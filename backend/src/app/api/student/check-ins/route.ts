import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: Student fetches their check-in assignments, scheduled sessions, and published feedback
export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'STUDENT' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Student role required' }, { status: 401 });
  }

  try {
    const assignments = await prisma.weeklyCheckInStudent.findMany({
      where: {
        studentId: user.id,
        checkIn: {
          status: { in: ['ACTIVE', 'COMPLETED'] }, // Students do not see DRAFT or SKIPPED cycles
        },
      },
      include: {
        checkIn: {
          select: {
            id: true,
            title: true,
            weekNumber: true,
            status: true,
            scheduledStartDate: true,
            scheduledEndDate: true,
            defaultDurationMinutes: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        feedback: {
          include: {
            actionItems: true,
          },
        },
      },
      orderBy: { checkIn: { weekNumber: 'desc' } },
    });

    // Student Privacy Filter: If feedback is still in DRAFT, redact draft contents from student view
    const studentSafeAssignments = assignments.map((a) => {
      let safeFeedback: any = null;
      if (a.feedback && a.feedback.status === 'PUBLISHED') {
        safeFeedback = a.feedback;
      }
      return {
        id: a.id,
        checkIn: a.checkIn,
        teacher: a.teacher,
        status: a.status,
        scheduledStartAt: a.scheduledStartAt,
        scheduledEndAt: a.scheduledEndAt,
        meetingUrl: a.meetingUrl,
        feedback: safeFeedback,
      };
    });

    return NextResponse.json({ success: true, assignments: studentSafeAssignments });
  } catch (error: any) {
    console.error('Error fetching student check-in assignments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
