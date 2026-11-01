import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = await params;

  try {
    const session = await prisma.mentorSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.studentId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You cannot cancel another student session' }, { status: 403 });
    }

    if (session.status !== 'SCHEDULED') {
      return NextResponse.json({ error: `Cannot cancel session with status ${session.status}` }, { status: 400 });
    }

    // Atomic transaction: mark session as CANCELLED and free the availability slot
    await prisma.$transaction(async (tx) => {
      await tx.mentorSession.update({
        where: { id: session.id },
        data: { status: 'CANCELLED' }
      });

      if (session.slotId) {
        await tx.mentorAvailabilitySlot.update({
          where: { id: session.slotId },
          data: { isBooked: false }
        });
      }

      // Notify Mentor
      await tx.notification.create({
        data: {
          userId: session.mentorId,
          message: `${user.name} has cancelled their 1:1 Mentorship Session scheduled for ${session.date} at ${session.time}.`,
          isRead: false
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Session cancelled and slot released successfully'
    });

  } catch (error: any) {
    console.error('Session cancellation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
