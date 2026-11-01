import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { clientIp, rateLimit } from '@/lib/rateLimit';
import { claimExpiry, getOffer } from '@/lib/discount';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reserves the early-bird discount for one email. The discount is applied at checkout only
// when the student pays while logged in with this email.
export async function POST(req: NextRequest) {
  const limited = rateLimit(`discount-claim:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
    );
  }

  try {
    const offer = getOffer();
    if (!offer.active) {
      return NextResponse.json({ error: 'This offer has ended.' }, { status: 410 });
    }

    const body = await req.json().catch(() => null);
    const { name, email, phone } = body ?? {};
    if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string' ||
        !name.trim() || !email.trim() || !phone.trim()) {
      return NextResponse.json({ error: 'Name, email and phone are required' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email.trim()) || name.length > 200 || email.length > 320 || phone.length > 30) {
      return NextResponse.json({ error: 'Invalid name, email or phone' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.discountClaim.findUnique({ where: { email: cleanEmail } });
    if (existing?.redeemedAt) {
      return NextResponse.json({ error: 'This offer has already been used with this email.' }, { status: 409 });
    }

    const expiresAt = claimExpiry();
    if (!existing) {
      await prisma.discountClaim.create({
        data: {
          email: cleanEmail,
          name: name.trim(),
          phone: phone.trim(),
          courseSlug: offer.courseSlug,
          percent: offer.percent,
          expiresAt,
        },
      });
      await prisma.lead.create({
        data: { source: 'DISCOUNT', name: name.trim(), email: cleanEmail, phone: phone.trim() },
      });
    }

    return NextResponse.json(
      { success: true, percent: offer.percent, expiresAt: (existing?.expiresAt ?? expiresAt).toISOString() },
      { status: existing ? 200 : 201 },
    );
  } catch (e) {
    console.error('[api/public/discount-claim]', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
