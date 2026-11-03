import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const studentsCount = await prisma.studentProfile.count();
    const coursesCount = await prisma.course.count();
    const batchesCount = await prisma.batch.count();
    const ticketsCount = await prisma.supportTicket.count({
      where: { status: { in: ['OPEN', 'IN_PROGRESS'] } }
    });

    // Average grade across all assignment submissions: points scored / points available.
    const [grade] = await prisma.$queryRaw<{ average: number | null }[]>`
      SELECT SUM(s."score")::float / NULLIF(SUM(q."points"), 0) * 100 AS average
      FROM "Submission" s JOIN "Question" q ON q."id" = s."questionId"
    `;
    const averageGrade = grade?.average == null ? null : Math.round(grade.average * 10) / 10;

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: studentsCount,
        totalCourses: coursesCount,
        totalBatches: batchesCount,
        unresolvedTickets: ticketsCount,
        averageGrade
      }
    });

  } catch (error: any) {
    console.error('Admin stats query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
