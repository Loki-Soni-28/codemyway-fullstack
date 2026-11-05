import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { enqueueCheckInNotification } from '@/lib/checkInNotificationWorker';

interface RouteContext {
  params: Promise<{ assignmentId: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const { assignmentId } = await context.params;

  try {
    const body = await req.json();
    const {
      amendmentReason,
      attendanceRating,
      taskCompletionScore,
      strengths,
      areasForImprovement,
      generalFeedback,
      nextWeekGoals,
    } = body;

    if (!amendmentReason || !amendmentReason.trim()) {
      return NextResponse.json(
        { error: 'A mandatory amendmentReason is required to amend published feedback.' },
        { status: 400 }
      );
    }

    const assignment = await prisma.weeklyCheckInStudent.findUnique({
      where: { id: assignmentId },
      include: {
        checkIn: true,
        feedback: true,
        student: { select: { id: true, name: true } },
      },
    });

    if (!assignment || !assignment.feedback) {
      return NextResponse.json({ error: 'Assignment or feedback record not found' }, { status: 404 });
    }

    if (assignment.feedback.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Only PUBLISHED feedback can be amended via the administrative amendment endpoint.' },
        { status: 400 }
      );
    }

    if (attendanceRating !== undefined && attendanceRating !== null) {
      const r = Number(attendanceRating);
      if (r < 1 || r > 5) {
        return NextResponse.json({ error: 'attendanceRating must be between 1 and 5' }, { status: 400 });
      }
    }

    if (taskCompletionScore !== undefined && taskCompletionScore !== null) {
      const s = Number(taskCompletionScore);
      if (s < 0 || s > 100) {
        return NextResponse.json({ error: 'taskCompletionScore must be between 0 and 100' }, { status: 400 });
      }
    }

    const previousFeedback = { ...assignment.feedback };

    const updatedFeedback = await prisma.$transaction(async (tx) => {
      const res = await tx.weeklyCheckInFeedback.update({
        where: { id: assignment.feedback!.id },
        data: {
          attendanceRating: attendanceRating !== undefined ? attendanceRating : assignment.feedback!.attendanceRating,
          taskCompletionScore: taskCompletionScore !== undefined ? taskCompletionScore : assignment.feedback!.taskCompletionScore,
          strengths: strengths !== undefined ? strengths : assignment.feedback!.strengths,
          areasForImprovement: areasForImprovement !== undefined ? areasForImprovement : assignment.feedback!.areasForImprovement,
          generalFeedback: generalFeedback !== undefined ? generalFeedback : assignment.feedback!.generalFeedback,
          nextWeekGoals: nextWeekGoals !== undefined ? nextWeekGoals : assignment.feedback!.nextWeekGoals,
        },
      });

      // Audit log mandatory amendment with before/after state
      await tx.weeklyCheckInAuditLog.create({
        data: {
          checkInId: assignment.checkInId,
          actorId: user.id,
          action: 'FEEDBACK_PUBLISHED',
          metadata: {
            amendmentReason: amendmentReason.trim(),
            assignmentId,
            feedbackId: res.id,
            previousState: {
              attendanceRating: previousFeedback.attendanceRating,
              taskCompletionScore: previousFeedback.taskCompletionScore,
              strengths: previousFeedback.strengths,
              areasForImprovement: previousFeedback.areasForImprovement,
            },
            newState: {
              attendanceRating: res.attendanceRating,
              taskCompletionScore: res.taskCompletionScore,
              strengths: res.strengths,
              areasForImprovement: res.areasForImprovement,
            },
          },
        },
      });

      // Notify student of amendment
      await enqueueCheckInNotification({
        checkInId: assignment.checkInId,
        assignmentId,
        eventType: 'FEEDBACK_AMENDED_STUDENT',
        recipientId: assignment.studentId,
        message: `Your weekly feedback for ${assignment.checkIn.title} was amended by admin: "${amendmentReason.trim()}".`,
        tx,
      });

      return res;
    });

    return NextResponse.json({ success: true, feedback: updatedFeedback });
  } catch (error: any) {
    console.error('Error amending feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
