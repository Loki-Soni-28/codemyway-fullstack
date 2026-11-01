import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: Mentor or Instructor retrieves their availability slots & booked sessions
export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'MENTOR' && user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Mentor or Instructor role required' }, { status: 401 });
  }

  try {
    const todayUtc = new Date().toISOString().split('T')[0];

    // Slots created by this mentor
    const slots = await prisma.mentorAvailabilitySlot.findMany({
      where: { mentorId: user.id },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    });

    // Booked sessions with students
    let studentIds: string[] = [];
    if (user.role === 'ADMIN') {
      const allStudents = await prisma.user.findMany({ where: { role: 'STUDENT' }, select: { id: true } });
      studentIds = allStudents.map(s => s.id);
    } else if (user.role === 'MENTOR') {
      const assigned = await prisma.studentProfile.findMany({
        where: { mentorId: user.id },
        select: { userId: true }
      });
      studentIds = assigned.map(p => p.userId);
    } else if (user.role === 'INSTRUCTOR') {
      const instructorClasses = await prisma.class.findMany({
        where: { instructorId: user.id },
        select: { batchId: true }
      });
      const batchIds = Array.from(new Set(instructorClasses.map(c => c.batchId)));
      const batchStudents = await prisma.studentProfile.findMany({
        where: { batchId: { in: batchIds } },
        select: { userId: true }
      });
      studentIds = batchStudents.map(p => p.userId);
    }

    const sessions = await prisma.mentorSession.findMany({
      where: {
        mentorId: user.id,
        studentId: { in: studentIds }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      slots: slots.map(s => ({
        id: s.id,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        isBooked: s.isBooked
      })),
      sessions: sessions.map(s => ({
        id: s.id,
        slotId: s.slotId,
        date: s.date,
        time: s.time,
        topic: s.topic,
        zoomLink: s.zoomLink,
        status: s.status,
        notes: s.notes,
        feedback: s.feedback,
        actionItems: s.actionItems ? JSON.parse(s.actionItems) : [],
        student: s.student
      }))
    });

  } catch (error: any) {
    console.error('Faculty mentorship fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Mentor creates new availability slots
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'MENTOR' && user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Mentor or Instructor role required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { date, startTime, endTime } = body;

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Date, startTime, and endTime are required' }, { status: 400 });
    }

    // Check that slot is not in the past
    const todayUtc = new Date().toISOString().split('T')[0];
    if (date < todayUtc) {
      return NextResponse.json({ error: 'Cannot create availability slots in the past' }, { status: 400 });
    }

    // Check for duplicate slot
    const existing = await prisma.mentorAvailabilitySlot.findUnique({
      where: {
        mentorId_date_startTime: {
          mentorId: user.id,
          date,
          startTime
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'A slot for this date and time already exists' }, { status: 409 });
    }

    const slot = await prisma.mentorAvailabilitySlot.create({
      data: {
        mentorId: user.id,
        date,
        startTime,
        endTime,
        isBooked: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Availability slot created successfully',
      slot
    });

  } catch (error: any) {
    console.error('Create mentor slot error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
