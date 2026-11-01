import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'MENTOR' && user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Mentor or Instructor role required' }, { status: 401 });
  }

  const { sessionId } = await params;

  try {
    const session = await prisma.mentorSession.findUnique({
      where: { id: sessionId },
      include: { student: true }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && session.mentorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only update sessions assigned to you' }, { status: 403 });
    }

    const body = await req.json();
    const { status, zoomLink, notes, feedback, actionItems } = body;

    const validStatuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const actionItemsJson = actionItems ? JSON.stringify(actionItems) : undefined;

    const updated = await prisma.mentorSession.update({
      where: { id: session.id },
      data: {
        ...(status && { status }),
        ...(zoomLink !== undefined && { zoomLink: zoomLink?.trim() || null }),
        ...(notes !== undefined && { notes: notes?.trim() || null }),
        ...(feedback !== undefined && { feedback: feedback?.trim() || null }),
        ...(actionItemsJson !== undefined && { actionItems: actionItemsJson })
      }
    });

    // If status updated to CANCELLED and was previously SCHEDULED, release slot
    if (status === 'CANCELLED' && session.status === 'SCHEDULED' && session.slotId) {
      await prisma.mentorAvailabilitySlot.update({
        where: { id: session.slotId },
        data: { isBooked: false }
      });
    }

    // Send in-app notification to student about updates or meeting link
    if (zoomLink && zoomLink.trim() && zoomLink !== session.zoomLink) {
      await prisma.notification.create({
        data: {
          userId: session.studentId,
          message: `Your mentor ${user.name} has added a meeting link for your session on ${session.date} at ${session.time}.`,
          isRead: false
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Session updated successfully',
      session: updated
    });

  } catch (error: any) {
    console.error('Update mentor session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
