import { prisma } from './db';
import { enqueueCheckInNotification } from './checkInNotificationWorker';

export interface LifecycleWorkerResult {
  reviewPendingCount: number;
  completedCheckInCount: number;
}

/**
 * Background Lifecycle Worker:
 * 1. Identifies SCHEDULED assignments whose `scheduledEndAt` has elapsed and transitions them to `REVIEW_PENDING`.
 * 2. Writes transactional audit logs and notifies the assigned teacher that feedback is pending.
 * 3. Identifies ACTIVE check-ins where 100% of assignments are in terminal states (`COMPLETED` or `MISSED`) and marks the check-in `COMPLETED`.
 * 4. Ensures idempotency and zero duplicate audit log creations.
 */
export async function runCheckInLifecycleWorker(): Promise<LifecycleWorkerResult> {
  const now = new Date();
  let reviewPendingCount = 0;
  let completedCheckInCount = 0;

  // -------------------------------------------------------------
  // Part 1: Transition past SCHEDULED sessions to REVIEW_PENDING
  // -------------------------------------------------------------
  const pastScheduledAssignments = await prisma.weeklyCheckInStudent.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledEndAt: {
        lte: now,
      },
    },
    include: {
      checkIn: true,
      student: { select: { id: true, name: true } },
      teacher: { select: { id: true, name: true } },
    },
    take: 50,
  });

  for (const assignment of pastScheduledAssignments) {
    try {
      await prisma.$transaction(async (tx) => {
        // Re-check status inside tx
        const current = await tx.weeklyCheckInStudent.findUnique({
          where: { id: assignment.id },
          select: { status: true },
        });

        if (current?.status !== 'SCHEDULED') return;

        // Update status to REVIEW_PENDING
        await tx.weeklyCheckInStudent.update({
          where: { id: assignment.id },
          data: { status: 'REVIEW_PENDING' },
        });

        // Audit log entry with null actorId for system-automated events
        await tx.weeklyCheckInAuditLog.create({
          data: {
            checkInId: assignment.checkInId,
            actorId: null,
            action: 'CHECKIN_STATUS_CHANGED',
            metadata: {
              assignmentId: assignment.id,
              studentId: assignment.studentId,
              previousStatus: 'SCHEDULED',
              newStatus: 'REVIEW_PENDING',
              trigger: 'SYSTEM_SESSION_COMPLETION',
            },
          },
        });

        // Notify teacher to complete feedback
        await enqueueCheckInNotification({
          checkInId: assignment.checkInId,
          assignmentId: assignment.id,
          eventType: 'REVIEW_PENDING_TEACHER',
          recipientId: assignment.teacherId,
          message: `The weekly check-in session for ${assignment.student.name} (Week ${assignment.checkIn.weekNumber}) has concluded. Please draft and publish feedback.`,
          metadata: { assignmentId: assignment.id },
          tx,
        });
      });

      reviewPendingCount++;
    } catch (err) {
      console.error(`Error transitioning assignment ${assignment.id} to REVIEW_PENDING:`, err);
    }
  }

  // -------------------------------------------------------------
  // Part 2: Transition ACTIVE check-ins to COMPLETED when all assignments resolved
  // -------------------------------------------------------------
  const activeCheckIns = await prisma.weeklyCheckIn.findMany({
    where: { status: 'ACTIVE' },
    include: {
      students: {
        select: { id: true, status: true },
      },
    },
    take: 20,
  });

  for (const checkIn of activeCheckIns) {
    if (checkIn.students.length === 0) {
      // Empty check-ins are not auto-completed without admin intervention
      continue;
    }

    const allFinished = checkIn.students.every(
      (s) => s.status === 'COMPLETED' || s.status === 'MISSED'
    );

    if (allFinished) {
      try {
        await prisma.$transaction(async (tx) => {
          const current = await tx.weeklyCheckIn.findUnique({
            where: { id: checkIn.id },
            select: { status: true },
          });

          if (current?.status !== 'ACTIVE') return;

          await tx.weeklyCheckIn.update({
            where: { id: checkIn.id },
            data: { status: 'COMPLETED' },
          });

          await tx.weeklyCheckInAuditLog.create({
            data: {
              checkInId: checkIn.id,
              actorId: null,
              action: 'CHECKIN_COMPLETED',
              metadata: {
                totalAssignments: checkIn.students.length,
                trigger: 'ALL_ASSIGNMENTS_CONCLUDED',
              },
            },
          });
        });

        completedCheckInCount++;
      } catch (err) {
        console.error(`Error completing checkIn ${checkIn.id}:`, err);
      }
    }
  }

  return {
    reviewPendingCount,
    completedCheckInCount,
  };
}
