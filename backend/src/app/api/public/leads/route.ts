import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { clientIp, rateLimit } from '@/lib/rateLimit';

const SOURCES = ['BROCHURE', 'TALK_TO_MENTOR', 'APPLY', 'NOTIFY'];
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const limited = rateLimit(`leads:${clientIp(req)}`, LIMIT, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const { source, name, email, phone, details } = body ?? {};

    if (!SOURCES.includes(source)) {
      return NextResponse.json({ error: 'Invalid lead source' }, { status: 400 });
    }
    if (typeof name !== 'string' || typeof email !== 'string' || typeof phone !== 'string' ||
        !name.trim() || !email.trim() || !phone.trim()) {
      return NextResponse.json({ error: 'Name, email and phone are required' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email.trim()) || name.length > 200 || email.length > 320 || phone.length > 30) {
      return NextResponse.json({ error: 'Invalid name, email or phone' }, { status: 400 });
    }
    if (details !== undefined && (typeof details !== 'object' || details === null || Array.isArray(details) ||
        JSON.stringify(details).length > 2000)) {
      return NextResponse.json({ error: 'Invalid details' }, { status: 400 });
    }

    await prisma.lead.create({
      data: {
        source,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        details: details ?? undefined,
      },
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    console.error('[api/public/leads]', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
