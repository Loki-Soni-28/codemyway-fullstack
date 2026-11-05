import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: Promise<{ actionItemId: string }>;
}

// PATCH: Student marks an assigned action item complete or reopens it
export async function PATCH(req: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'STUDENT' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Student role required' }, { status: 401 });
  }

  const { actionItemId } = await context.params;

  try {
    const body = await req.json();
    const { isCompleted } = body;

    if (typeof isCompleted !== 'boolean') {
      return NextResponse.json({ error: 'isCompleted (boolean) is required' }, { status: 400 });
    }

    const actionItem = await prisma.weeklyCheckInActionItem.findUnique({
      where: { id: actionItemId },
      include: {
        feedback: {
          include: {
            assignment: true,
          },
        },
      },
    });

    if (!actionItem) {
      return NextResponse.json({ error: 'Action item not found' }, { status: 404 });
    }

    // Ownership check: Student can only toggle action items belonging to their own assignments
    if (actionItem.feedback.assignment.studentId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update action items assigned to you.' },
        { status: 403 }
      );
    }

    // Must belong to published feedback
    if (actionItem.feedback.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Action items cannot be updated while feedback is still in draft.' },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.weeklyCheckInActionItem.update({
        where: { id: actionItemId },
        data: {
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      });

      // Audit log the status update
      await tx.weeklyCheckInAuditLog.create({
        data: {
          checkInId: actionItem.feedback.assignment.checkInId,
          actorId: user.id,
          action: 'ACTION_ITEM_STATUS_CHANGED',
          metadata: {
            actionItemId,
            isCompleted,
            assignmentId: actionItem.feedback.assignmentId,
          },
        },
      });

      return res;
    });

    return NextResponse.json({ success: true, actionItem: updated });
  } catch (error: any) {
    console.error('Error updating action item status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
