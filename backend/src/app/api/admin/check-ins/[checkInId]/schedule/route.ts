import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { validateSessionCollisions } from '@/lib/checkInValidation';
import { enqueueCheckInNotification } from '@/lib/checkInNotificationWorker';

interface RouteContext {
  params: Promise<{ checkInId: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const { checkInId } = await context.params;

  try {
    const body = await req.json();
    const { sessions } = body;

    if (!Array.isArray(sessions) || sessions.length === 0) {
      return NextResponse.json(
        { error: 'sessions must be a non-empty array of { assignmentId, scheduledStartAt, scheduledEndAt, meetingUrl? }' },
        { status: 400 }
      );
    }

    const checkIn = await prisma.weeklyCheckIn.findUnique({
      where: { id: checkInId },
    });

    if (!checkIn) {
      return NextResponse.json({ error: 'Weekly check-in not found' }, { status: 404 });
    }

    if (checkIn.status === 'COMPLETED' || checkIn.status === 'SKIPPED') {
      return NextResponse.json(
        { error: `Cannot schedule sessions for a ${checkIn.status} check-in.` },
        { status: 400 }
      );
    }

    const assignmentIds = sessions.map((s: any) => s.assignmentId);
    const existingAssignments = await prisma.weeklyCheckInStudent.findMany({
      where: {
        id: { in: assignmentIds },
        checkInId,
      },
      include: {
        student: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
        feedback: true,
      },
    });

    if (existingAssignments.length !== assignmentIds.length) {
      return NextResponse.json(
        { error: 'One or more assignment IDs do not exist within this weekly check-in.' },
        { status: 400 }
      );
    }

    // Protect immutable / completed assignments
    for (const a of existingAssignments) {
      if (a.feedback && a.feedback.status === 'PUBLISHED') {
        return NextResponse.json(
          { error: `Assignment ${a.id} already has PUBLISHED feedback and cannot be rescheduled.` },
          { status: 400 }
        );
      }
      if (a.status === 'COMPLETED' || a.status === 'MISSED') {
        return NextResponse.json(
          { error: `Assignment ${a.id} is already ${a.status} and cannot be rescheduled.` },
          { status: 400 }
        );
      }
    }

    // Build proposed sessions map for collision checking
    const proposed = sessions.map((s: any) => {
      const existing = existingAssignments.find((a) => a.id === s.assignmentId)!;
      return {
        assignmentId: s.assignmentId,
        teacherId: existing.teacherId,
        studentId: existing.studentId,
        scheduledStartAt: new Date(s.scheduledStartAt),
        scheduledEndAt: new Date(s.scheduledEndAt),
      };
    });

    // Check collisions
    const collisionResult = await validateSessionCollisions(proposed);
    if (collisionResult.hasCollision) {
      return NextResponse.json({ error: collisionResult.reason }, { status: 409 });
    }

    // Perform updates inside a transaction
    const updated = await prisma.$transaction(async (tx) => {
      const results = [];
      for (const s of sessions) {
        const existing = existingAssignments.find((a) => a.id === s.assignmentId)!;
        const start = new Date(s.scheduledStartAt);
        const end = new Date(s.scheduledEndAt);
        const meetingUrl = s.meetingUrl !== undefined ? s.meetingUrl : existing.meetingUrl;

        const res = await tx.weeklyCheckInStudent.update({
          where: { id: s.assignmentId },
          data: {
            scheduledStartAt: start,
            scheduledEndAt: end,
            meetingUrl,
            status: 'SCHEDULED',
          },
        });

        results.push(res);

        // Audit log for each rescheduled session
        await tx.weeklyCheckInAuditLog.create({
          data: {
            checkInId,
            actorId: user.id,
            action: 'STUDENT_SCHEDULED',
            metadata: {
              assignmentId: s.assignmentId,
              studentId: existing.studentId,
              teacherId: existing.teacherId,
              scheduledStartAt: start.toISOString(),
              scheduledEndAt: end.toISOString(),
              meetingUrl,
            },
          },
        });

        // Enqueue notifications if check-in is ACTIVE
        if (checkIn.status === 'ACTIVE') {
          await enqueueCheckInNotification({
            checkInId,
            assignmentId: s.assignmentId,
            eventType: 'SESSION_SCHEDULED_STUDENT',
            recipientId: existing.studentId,
            message: `Your check-in session for ${checkIn.title} has been scheduled for ${start.toLocaleString()}.`,
            tx,
          });

          await enqueueCheckInNotification({
            checkInId,
            assignmentId: s.assignmentId,
            eventType: 'SESSION_SCHEDULED_TEACHER',
            recipientId: existing.teacherId,
            message: `Check-in session for ${existing.student.name} (${checkIn.title}) scheduled for ${start.toLocaleString()}.`,
            tx,
          });
        }
      }

      return results;
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error('Error scheduling check-in sessions:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
