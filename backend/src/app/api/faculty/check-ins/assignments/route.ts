import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: List all check-in assignments assigned to the calling teacher/faculty
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'MENTOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Faculty role required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const checkInId = searchParams.get('checkInId');

  try {
    const where: any = {
      teacherId: user.id,
    };
    if (checkInId) where.checkInId = checkInId;

    const assignments = await prisma.weeklyCheckInStudent.findMany({
      where,
      include: {
        checkIn: {
          select: {
            id: true,
            title: true,
            weekNumber: true,
            status: true,
            scheduledStartDate: true,
            scheduledEndDate: true,
            batch: { select: { id: true, name: true } },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
        feedback: {
          include: {
            actionItems: true,
          },
        },
      },
      orderBy: [
        { checkIn: { weekNumber: 'desc' } },
        { scheduledStartAt: 'asc' },
      ],
    });

    return NextResponse.json({ success: true, assignments });
  } catch (error: any) {
    console.error('Error fetching teacher check-in assignments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
