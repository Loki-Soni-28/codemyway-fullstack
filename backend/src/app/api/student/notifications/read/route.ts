import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'STUDENT' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[src/app/api\student\notifications\read\route.ts]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
