import { NextResponse } from 'next/server';
import { getOffer } from '@/lib/discount';

export async function GET() {
  const offer = getOffer();
  return NextResponse.json({
    active: offer.active,
    endsAt: offer.endsAt?.toISOString() ?? null,
    percent: offer.percent,
  });
}
