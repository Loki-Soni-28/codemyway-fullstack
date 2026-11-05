import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'STUDENT' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    console.error('[src/app/api\student\notifications\route.ts]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
