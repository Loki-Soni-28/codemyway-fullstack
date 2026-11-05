import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'STUDENT' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const activeMentorId = user.studentProfile?.mentorId;
    let mentorProfile = null;

    if (activeMentorId) {
      const mentorUser = await prisma.user.findUnique({
        where: { id: activeMentorId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true
        }
      });

      if (mentorUser) {
        // Fetch real available slots for this mentor (not yet booked, date >= today UTC)
        const todayUtc = new Date().toISOString().split('T')[0];
        const availableSlots = await prisma.mentorAvailabilitySlot.findMany({
          where: {
            mentorId: mentorUser.id,
            isBooked: false,
            date: { gte: todayUtc }
          },
          orderBy: [
            { date: 'asc' },
            { startTime: 'asc' }
          ]
        });

        mentorProfile = {
          ...mentorUser,
          availableSlots: availableSlots.map(s => ({
            id: s.id,
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
            isBooked: s.isBooked
          }))
        };
      }
    }

    // Fetch student's own booked sessions
    const sessions = await prisma.mentorSession.findMany({
      where: { studentId: user.id },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ],
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      assignedMentor: mentorProfile,
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
        mentor: s.mentor
      }))
    });

  } catch (error: any) {
    console.error('Student mentor fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'STUDENT' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const activeMentorId = user.studentProfile?.mentorId;
  if (!activeMentorId) {
    return NextResponse.json({ error: 'No mentor assigned to your student profile' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { slotId, topic } = body;

    if (!slotId || !topic || !topic.trim()) {
      return NextResponse.json({ error: 'Slot ID and discussion topic are required' }, { status: 400 });
    }

    // Atomic transaction: verify slot is unbooked, belongs to assigned mentor, is not in the past, and lock it
    const result = await prisma.$transaction(async (tx) => {
      const slot = await tx.mentorAvailabilitySlot.findUnique({
        where: { id: slotId }
      });

      if (!slot) {
        throw new Error('SLOT_NOT_FOUND');
      }

      if (slot.mentorId !== activeMentorId) {
        throw new Error('UNAUTHORIZED_MENTOR_SLOT');
      }

      if (slot.isBooked) {
        throw new Error('SLOT_ALREADY_BOOKED');
      }

      const todayUtc = new Date().toISOString().split('T')[0];
      if (slot.date < todayUtc) {
        throw new Error('PAST_SLOT_NOT_ALLOWED');
      }

      // Check if student already has an active overlapping session at this date & time
      const existingStudentSession = await tx.mentorSession.findFirst({
        where: {
          studentId: user.id,
          date: slot.date,
          time: slot.startTime,
          status: 'SCHEDULED'
        }
      });

      if (existingStudentSession) {
        throw new Error('STUDENT_OVERLAPPING_SESSION');
      }

      // Mark slot as booked
      await tx.mentorAvailabilitySlot.update({
        where: { id: slot.id },
        data: { isBooked: true }
      });

      // Create MentorSession record
      const session = await tx.mentorSession.create({
        data: {
          studentId: user.id,
          mentorId: activeMentorId,
          slotId: slot.id,
          date: slot.date,
          time: slot.startTime,
          topic: topic.trim(),
          status: 'SCHEDULED'
        }
      });

      // Send in-app notification to student
      await tx.notification.create({
        data: {
          userId: user.id,
          message: `Your 1:1 Mentorship Session on "${topic.trim()}" has been confirmed for ${slot.date} at ${slot.startTime} UTC.`,
          isRead: false
        }
      });

      // Send in-app notification to mentor
      await tx.notification.create({
        data: {
          userId: activeMentorId,
          message: `${user.name} has booked a 1:1 Mentorship Session on "${topic.trim()}" for ${slot.date} at ${slot.startTime} UTC.`,
          isRead: false
        }
      });

      return session;
    });

    return NextResponse.json({
      success: true,
      message: 'Mentorship session booked successfully',
      session: result
    });

  } catch (error: any) {
    if (error.message === 'SLOT_NOT_FOUND') {
      return NextResponse.json({ error: 'Mentorship slot not found' }, { status: 404 });
    }
    if (error.message === 'UNAUTHORIZED_MENTOR_SLOT') {
      return NextResponse.json({ error: 'Forbidden: You can only book slots with your assigned mentor' }, { status: 403 });
    }
    if (error.message === 'SLOT_ALREADY_BOOKED') {
      return NextResponse.json({ error: 'This slot has already been booked by another student' }, { status: 409 });
    }
    if (error.message === 'PAST_SLOT_NOT_ALLOWED') {
      return NextResponse.json({ error: 'Cannot book slots in the past' }, { status: 400 });
    }
    if (error.message === 'STUDENT_OVERLAPPING_SESSION') {
      return NextResponse.json({ error: 'You already have another session scheduled at this date and time' }, { status: 409 });
    }

    console.error('Mentor booking error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
