import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { computeBatchLeaderboard } from '@/lib/leaderboard';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = user.studentProfile;
  if (!profile || !profile.batchId) {
    return NextResponse.json({ error: 'No active batch' }, { status: 400 });
  }

  try {
    const leaderboard = await computeBatchLeaderboard(profile.batchId);
    return NextResponse.json({ success: true, leaderboard });
  } catch (error: any) {
    console.error('Leaderboard query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
