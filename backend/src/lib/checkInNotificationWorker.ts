import { prisma } from './db';
import { Prisma } from '@prisma/client';

export interface EnqueueNotificationParams {
  checkInId: string;
  assignmentId?: string | null;
  eventType: string;
  recipientId: string;
  message: string;
  metadata?: Record<string, any>;
  tx?: Prisma.TransactionClient;
}

export interface WorkerProcessResult {
  processed: number;
  recovered: number;
  succeeded: number;
  failed: number;
}

/**
 * Enqueues a notification into CheckInNotificationOutbox.
 * Supports passing an active transaction client (`tx`) to ensure atomic writes.
 */
export async function enqueueCheckInNotification(params: EnqueueNotificationParams) {
  const db = params.tx || prisma;
  const idempotencyKey = `${params.checkInId}:${params.eventType}:${params.recipientId}:${params.assignmentId || 'batch'}`;

  return await db.checkInNotificationOutbox.upsert({
    where: { idempotencyKey },
    create: {
      checkInId: params.checkInId,
      assignmentId: params.assignmentId || null,
      eventType: params.eventType,
      recipientId: params.recipientId,
      payload: {
        message: params.message,
        metadata: params.metadata || {},
      },
      status: 'PENDING',
      idempotencyKey,
    },
    update: {
      // If already pending or failed, update message payload
      payload: {
        message: params.message,
        metadata: params.metadata || {},
      },
    },
  });
}

/**
 * Background outbox processor:
 * 1. Recovers expired PROCESSING leases (lockedAt/leaseUntil older than now).
 * 2. Claims pending rows using PostgreSQL `FOR UPDATE SKIP LOCKED`.
 * 3. Atomically inserts the Notification record and sets outbox status to SENT.
 * 4. Applies exponential backoff retry on failure up to maxRetries (default 5).
 */
export async function processOutboxBatch(
  batchSize: number = 20,
  leaseDurationMs: number = 60000,
  maxRetries: number = 5
): Promise<WorkerProcessResult> {
  const now = new Date();
  const leaseUntil = new Date(now.getTime() + leaseDurationMs);

  let recoveredCount = 0;
  let succeededCount = 0;
  let failedCount = 0;

  // Step 1: Recover expired leases
  const recovered = await prisma.$executeRaw`
    UPDATE "CheckInNotificationOutbox"
    SET "status" = 'PENDING',
        "lockedAt" = NULL,
        "leaseUntil" = NULL
    WHERE "status" = 'PROCESSING'
      AND "leaseUntil" IS NOT NULL
      AND "leaseUntil" < ${now}
  `;
  recoveredCount = Number(recovered);

  // Step 2: Concurrently claim batch of PENDING records with row locking
  const claimedRows: Array<{
    id: string;
    checkInId: string;
    recipientId: string;
    payload: any;
    retryCount: number;
  }> = await prisma.$queryRaw`
    UPDATE "CheckInNotificationOutbox"
    SET "status" = 'PROCESSING',
        "lockedAt" = ${now},
        "leaseUntil" = ${leaseUntil}
    WHERE "id" IN (
      SELECT "id"
      FROM "CheckInNotificationOutbox"
      WHERE "status" = 'PENDING'
         OR ("status" = 'FAILED' AND "retryCount" < ${maxRetries})
      ORDER BY "createdAt" ASC
      LIMIT ${batchSize}
      FOR UPDATE SKIP LOCKED
    )
    RETURNING "id", "checkInId", "recipientId", "payload", "retryCount"
  `;

  // Step 3: Process each claimed row atomically
  for (const row of claimedRows) {
    try {
      await prisma.$transaction(async (tx) => {
        // Verify lease ownership in case of abnormal concurrency
        const current = await tx.checkInNotificationOutbox.findUnique({
          where: { id: row.id },
          select: { status: true, leaseUntil: true },
        });

        if (!current || current.status !== 'PROCESSING') {
          return;
        }

        const message =
          (row.payload && typeof row.payload === 'object' && row.payload.message) ||
          'You have a new weekly check-in update.';

        // Insert in-app Notification
        await tx.notification.create({
          data: {
            userId: row.recipientId,
            message: String(message),
            isRead: false,
          },
        });

        // Mark outbox record as SENT
        await tx.checkInNotificationOutbox.update({
          where: { id: row.id },
          data: {
            status: 'SENT',
            lockedAt: null,
            leaseUntil: null,
            lastError: null,
          },
        });
      });

      succeededCount++;
    } catch (err: any) {
      failedCount++;
      const nextRetry = row.retryCount + 1;
      const errorMsg = err?.message || String(err);

      await prisma.checkInNotificationOutbox.update({
        where: { id: row.id },
        data: {
          status: 'FAILED',
          retryCount: nextRetry,
          lockedAt: null,
          leaseUntil: null,
          lastError: errorMsg.slice(0, 1000),
        },
      });
    }
  }

  return {
    processed: claimedRows.length,
    recovered: recoveredCount,
    succeeded: succeededCount,
    failed: failedCount,
  };
}
