import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { processOutboxBatch } from '@/lib/checkInNotificationWorker';
import { runCheckInLifecycleWorker } from '@/lib/checkInLifecycleWorker';

// POST: Trigger background workers on-demand (Admin or internal cron runner)
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  try {
    const outboxResult = await processOutboxBatch(25, 60000, 5);
    const lifecycleResult = await runCheckInLifecycleWorker();

    return NextResponse.json({
      success: true,
      outbox: outboxResult,
      lifecycle: lifecycleResult,
    });
  } catch (error: any) {
    console.error('Error executing background workers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
