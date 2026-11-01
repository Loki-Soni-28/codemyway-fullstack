import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: List weekly check-ins across batches
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get('batchId');

  try {
    const where: any = {};
    if (batchId) where.batchId = batchId;

    const checkIns = await prisma.weeklyCheckIn.findMany({
      where,
      include: {
        batch: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        students: {
          select: {
            id: true,
            status: true,
            studentId: true,
            teacherId: true,
            scheduledStartAt: true,
            scheduledEndAt: true,
          },
        },
      },
      orderBy: [{ weekNumber: 'desc' }, { scheduledStartDate: 'desc' }],
    });

    return NextResponse.json({ success: true, checkIns });
  } catch (error: any) {
    console.error('Error fetching admin weekly check-ins:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new weekly check-in cycle or mark a week as SKIPPED
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      batchId,
      weekNumber,
      title,
      scheduledStartDate,
      scheduledEndDate,
      defaultDurationMinutes = 30,
      isSkipped = false,
      skipReason,
    } = body;

    if (!batchId || !weekNumber || !title) {
      return NextResponse.json(
        { error: 'batchId, weekNumber, and title are required' },
        { status: 400 }
      );
    }

    if (Number(weekNumber) <= 0) {
      return NextResponse.json({ error: 'weekNumber must be a positive integer' }, { status: 400 });
    }

    if (isSkipped) {
      if (!skipReason || !skipReason.trim()) {
        return NextResponse.json(
          { error: 'A mandatory skipReason is required when skipping a weekly check-in' },
          { status: 400 }
        );
      }
    }

    const startDate = new Date(scheduledStartDate);
    const endDate = new Date(scheduledEndDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate) {
      return NextResponse.json(
        { error: 'scheduledStartDate must be a valid date preceding scheduledEndDate' },
        { status: 400 }
      );
    }

    if (![15, 30, 45, 60].includes(Number(defaultDurationMinutes))) {
      return NextResponse.json(
        { error: 'defaultDurationMinutes must be one of [15, 30, 45, 60]' },
        { status: 400 }
      );
    }

    // Check if check-in for this batch and weekNumber already exists
    const existing = await prisma.weeklyCheckIn.findUnique({
      where: {
        batchId_weekNumber: {
          batchId,
          weekNumber: Number(weekNumber),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Weekly check-in for week ${weekNumber} in this batch already exists` },
        { status: 409 }
      );
    }

    const checkIn = await prisma.$transaction(async (tx) => {
      const created = await tx.weeklyCheckIn.create({
        data: {
          batchId,
          weekNumber: Number(weekNumber),
          title,
          status: isSkipped ? 'SKIPPED' : 'DRAFT',
          scheduledStartDate: startDate,
          scheduledEndDate: endDate,
          defaultDurationMinutes: Number(defaultDurationMinutes),
          skipReason: isSkipped ? skipReason.trim() : null,
          createdById: user.id,
        },
      });

      await tx.weeklyCheckInAuditLog.create({
        data: {
          checkInId: created.id,
          actorId: user.id,
          action: 'CHECKIN_CREATED',
          metadata: {
            title: created.title,
            weekNumber: created.weekNumber,
            status: created.status,
            skipReason: created.skipReason,
          },
        },
      });

      return created;
    });

    return NextResponse.json({ success: true, checkIn });
  } catch (error: any) {
    console.error('Error creating weekly check-in:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
