import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: List active batches and their eligible teachers
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get('batchId');

  try {
    const whereClause: any = {};
    if (batchId) whereClause.batchId = batchId;

    const batchTeachers = await prisma.batchTeacher.findMany({
      where: whereClause,
      include: {
        batch: { select: { id: true, name: true, courseId: true } },
        teacher: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: [{ batch: { name: 'asc' } }, { teacher: { name: 'asc' } }],
    });

    const teachers = await prisma.user.findMany({
      where: { role: { in: ['INSTRUCTOR', 'MENTOR'] } },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    });

    const batches = await prisma.batch.findMany({
      select: { id: true, name: true, courseId: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      batchTeachers,
      availableTeachers: teachers,
      batches,
    });
  } catch (error: any) {
    console.error('Error fetching batch teachers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add or update teacher eligibility for a batch
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { batchId, teacherId, isActive } = body;

    if (!batchId || !teacherId) {
      return NextResponse.json({ error: 'batchId and teacherId are required' }, { status: 400 });
    }

    // Verify teacher exists and has faculty role
    const teacherUser = await prisma.user.findUnique({
      where: { id: teacherId },
      select: { id: true, role: true },
    });

    if (!teacherUser || (teacherUser.role !== 'INSTRUCTOR' && teacherUser.role !== 'MENTOR' && teacherUser.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Target user must be an Instructor or Mentor' }, { status: 400 });
    }

    const batchTeacher = await prisma.batchTeacher.upsert({
      where: {
        batchId_teacherId: { batchId, teacherId },
      },
      create: {
        batchId,
        teacherId,
        isActive: isActive !== false,
      },
      update: {
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, batchTeacher });
  } catch (error: any) {
    console.error('Error updating batch teacher eligibility:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
