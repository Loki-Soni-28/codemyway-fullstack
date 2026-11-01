import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { enqueueCheckInNotification } from '@/lib/checkInNotificationWorker';

interface RouteContext {
  params: Promise<{ checkInId: string }>;
}

// GET: Single check-in detail with assignments, feedback, action items, and audit logs
export async function GET(req: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const { checkInId } = await context.params;

  try {
    const checkIn = await prisma.weeklyCheckIn.findUnique({
      where: { id: checkInId },
      include: {
        batch: { select: { id: true, name: true, courseId: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        students: {
          include: {
            student: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
            teacher: { select: { id: true, name: true, email: true, avatarUrl: true } },
            feedback: {
              include: {
                actionItems: true,
              },
            },
          },
          orderBy: { student: { name: 'asc' } },
        },
        auditLogs: {
          include: {
            actor: { select: { id: true, name: true, role: true } },
          },
          orderBy: { occurredAt: 'desc' },
        },
      },
    });

    if (!checkIn) {
      return NextResponse.json({ error: 'Weekly check-in not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, checkIn });
  } catch (error: any) {
    console.error('Error fetching check-in details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Publish check-in or Close unresolved check-in past the permitted window
export async function PATCH(req: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const { checkInId } = await context.params;

  try {
    const body = await req.json();
    const { action, closeReason, skipReason } = body;

    const checkIn = await prisma.weeklyCheckIn.findUnique({
      where: { id: checkInId },
      include: {
        students: {
          select: { id: true, studentId: true, teacherId: true, status: true },
        },
      },
    });

    if (!checkIn) {
      return NextResponse.json({ error: 'Weekly check-in not found' }, { status: 404 });
    }

    if (action === 'PUBLISH') {
      if (checkIn.status !== 'DRAFT') {
        return NextResponse.json(
          { error: `Cannot publish check-in in ${checkIn.status} state. Only DRAFT can be published.` },
          { status: 400 }
        );
      }

      if (checkIn.students.length === 0) {
        return NextResponse.json(
          { error: 'Cannot publish a check-in with 0 assigned students. Allocate students first.' },
          { status: 400 }
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        const res = await tx.weeklyCheckIn.update({
          where: { id: checkInId },
          data: { status: 'ACTIVE' },
        });

        await tx.weeklyCheckInAuditLog.create({
          data: {
            checkInId,
            actorId: user.id,
            action: 'CHECKIN_STATUS_CHANGED',
            metadata: {
              previousStatus: 'DRAFT',
              newStatus: 'ACTIVE',
              action: 'ADMIN_PUBLISHED',
            },
          },
        });

        // Enqueue notifications for all assigned students and teachers
        const teacherIds = Array.from(new Set(checkIn.students.map((s) => s.teacherId)));
        for (const teacherId of teacherIds) {
          await enqueueCheckInNotification({
            checkInId,
            eventType: 'CHECKIN_ACTIVATED_TEACHER',
            recipientId: teacherId,
            message: `Weekly check-in "${checkIn.title}" is now active. Review your assigned students.`,
            tx,
          });
        }

        for (const s of checkIn.students) {
          await enqueueCheckInNotification({
            checkInId,
            assignmentId: s.id,
            eventType: 'CHECKIN_ACTIVATED_STUDENT',
            recipientId: s.studentId,
            message: `Weekly check-in "${checkIn.title}" has been published. Your weekly check-in session is ready.`,
            tx,
          });
        }

        return res;
      });

      return NextResponse.json({ success: true, checkIn: updated });
    }

    if (action === 'CLOSE') {
      if (checkIn.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: `Only ACTIVE check-ins can be closed. Current status: ${checkIn.status}` },
          { status: 400 }
        );
      }

      if (!closeReason || !closeReason.trim()) {
        return NextResponse.json(
          { error: 'A mandatory closeReason is required when closing an unresolved check-in.' },
          { status: 400 }
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        // Mark remaining ASSIGNED or SCHEDULED assignments as MISSED
        await tx.weeklyCheckInStudent.updateMany({
          where: {
            checkInId,
            status: { in: ['ASSIGNED', 'SCHEDULED', 'REVIEW_PENDING'] },
          },
          data: { status: 'MISSED' },
        });

        const res = await tx.weeklyCheckIn.update({
          where: { id: checkInId },
          data: { status: 'COMPLETED' },
        });

        await tx.weeklyCheckInAuditLog.create({
          data: {
            checkInId,
            actorId: user.id,
            action: 'CHECKIN_COMPLETED',
            metadata: {
              closeReason: closeReason.trim(),
              action: 'ADMIN_FORCED_CLOSE',
            },
          },
        });

        return res;
      });

      return NextResponse.json({ success: true, checkIn: updated });
    }

    if (action === 'SKIP') {
      if (checkIn.status !== 'DRAFT') {
        return NextResponse.json(
          { error: `Only DRAFT check-ins can be marked as SKIPPED. Current status: ${checkIn.status}` },
          { status: 400 }
        );
      }

      if (!skipReason || !skipReason.trim()) {
        return NextResponse.json(
          { error: 'A mandatory skipReason is required when skipping a check-in.' },
          { status: 400 }
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        const res = await tx.weeklyCheckIn.update({
          where: { id: checkInId },
          data: {
            status: 'SKIPPED',
            skipReason: skipReason.trim(),
          },
        });

        await tx.weeklyCheckInAuditLog.create({
          data: {
            checkInId,
            actorId: user.id,
            action: 'CHECKIN_STATUS_CHANGED',
            metadata: {
              previousStatus: 'DRAFT',
              newStatus: 'SKIPPED',
              skipReason: skipReason.trim(),
            },
          },
        });

        return res;
      });

      return NextResponse.json({ success: true, checkIn: updated });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported actions: PUBLISH, CLOSE, SKIP' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error updating weekly check-in:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
