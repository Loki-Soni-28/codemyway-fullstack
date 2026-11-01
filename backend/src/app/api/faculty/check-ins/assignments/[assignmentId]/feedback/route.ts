import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { enqueueCheckInNotification } from '@/lib/checkInNotificationWorker';

interface RouteContext {
  params: Promise<{ assignmentId: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'MENTOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Faculty role required' }, { status: 401 });
  }

  const { assignmentId } = await context.params;

  try {
    const body = await req.json();
    const {
      publish = false,
      attendanceRating,
      taskCompletionScore,
      strengths,
      areasForImprovement,
      generalFeedback,
      nextWeekGoals,
      actionItems = [],
    } = body;

    const assignment = await prisma.weeklyCheckInStudent.findUnique({
      where: { id: assignmentId },
      include: {
        checkIn: true,
        feedback: { include: { actionItems: true } },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Cohort / teacher isolation check
    if (user.role !== 'ADMIN' && assignment.teacherId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only provide feedback for students assigned to you.' },
        { status: 403 }
      );
    }

    // Published feedback immutability rule
    if (assignment.feedback && assignment.feedback.status === 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Feedback has already been PUBLISHED and cannot be modified directly. Admin amendment is required.' },
        { status: 400 }
      );
    }

    // Rating & Score Validation
    let parsedAttendance: number | null = null;
    if (attendanceRating !== undefined && attendanceRating !== null && attendanceRating !== '') {
      parsedAttendance = Number(attendanceRating);
      if (parsedAttendance < 1 || parsedAttendance > 5) {
        return NextResponse.json({ error: 'attendanceRating must be between 1 and 5' }, { status: 400 });
      }
    }

    let parsedScore: number | null = null;
    if (taskCompletionScore !== undefined && taskCompletionScore !== null && taskCompletionScore !== '') {
      parsedScore = Number(taskCompletionScore);
      if (parsedScore < 0 || parsedScore > 100) {
        return NextResponse.json({ error: 'taskCompletionScore must be between 0 and 100' }, { status: 400 });
      }
    }

    // Publishing requirements
    if (publish) {
      if (parsedAttendance === null || parsedScore === null) {
        return NextResponse.json(
          { error: 'Both attendanceRating (1-5) and taskCompletionScore (0-100) are required when publishing feedback.' },
          { status: 400 }
        );
      }
      if (!generalFeedback || !generalFeedback.trim()) {
        return NextResponse.json(
          { error: 'generalFeedback is required when publishing feedback.' },
          { status: 400 }
        );
      }
    }

    const feedbackStatus = publish ? 'PUBLISHED' : 'DRAFT';
    const publishedAt = publish ? new Date() : null;

    const saved = await prisma.$transaction(async (tx) => {
      // 1. Upsert Feedback
      const fb = await tx.weeklyCheckInFeedback.upsert({
        where: { assignmentId },
        create: {
          assignmentId,
          status: feedbackStatus,
          attendanceRating: parsedAttendance,
          taskCompletionScore: parsedScore,
          strengths: strengths || null,
          areasForImprovement: areasForImprovement || null,
          generalFeedback: generalFeedback || null,
          nextWeekGoals: nextWeekGoals || null,
          publishedAt,
        },
        update: {
          status: feedbackStatus,
          attendanceRating: parsedAttendance,
          taskCompletionScore: parsedScore,
          strengths: strengths || null,
          areasForImprovement: areasForImprovement || null,
          generalFeedback: generalFeedback || null,
          nextWeekGoals: nextWeekGoals || null,
          publishedAt: publish ? (assignment.feedback?.publishedAt || publishedAt) : assignment.feedback?.publishedAt,
        },
      });

      // 2. Action items management (only teachers can add/remove action items in draft)
      if (Array.isArray(actionItems)) {
        for (const item of actionItems) {
          if (item.id) {
            // Update existing description if provided
            await tx.weeklyCheckInActionItem.updateMany({
              where: { id: item.id, feedbackId: fb.id },
              data: { description: item.description },
            });
          } else if (item.description && item.description.trim()) {
            await tx.weeklyCheckInActionItem.create({
              data: {
                feedbackId: fb.id,
                description: item.description.trim(),
                isCompleted: false,
              },
            });
          }
        }
      }

      // 3. If publishing, update assignment status to COMPLETED
      if (publish) {
        await tx.weeklyCheckInStudent.update({
          where: { id: assignmentId },
          data: { status: 'COMPLETED' },
        });

        // Audit log for publish
        await tx.weeklyCheckInAuditLog.create({
          data: {
            checkInId: assignment.checkInId,
            actorId: user.id,
            action: 'FEEDBACK_PUBLISHED',
            metadata: {
              assignmentId,
              feedbackId: fb.id,
              attendanceRating: parsedAttendance,
              taskCompletionScore: parsedScore,
            },
          },
        });

        // Enqueue notification for student
        await enqueueCheckInNotification({
          checkInId: assignment.checkInId,
          assignmentId,
          eventType: 'FEEDBACK_PUBLISHED_STUDENT',
          recipientId: assignment.studentId,
          message: `Your teacher has published weekly feedback and action items for ${assignment.checkIn.title}.`,
          tx,
        });
      } else {
        // Audit log for draft save
        await tx.weeklyCheckInAuditLog.create({
          data: {
            checkInId: assignment.checkInId,
            actorId: user.id,
            action: 'FEEDBACK_DRAFT_SAVED',
            metadata: {
              assignmentId,
              feedbackId: fb.id,
            },
          },
        });
      }

      return tx.weeklyCheckInFeedback.findUnique({
        where: { id: fb.id },
        include: { actionItems: true },
      });
    });

    return NextResponse.json({ success: true, feedback: saved });
  } catch (error: any) {
    console.error('Error saving weekly check-in feedback:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
