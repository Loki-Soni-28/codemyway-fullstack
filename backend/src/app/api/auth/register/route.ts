import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readJsonObject, badJson, tooManyRequests, EMAIL_RE } from '@/lib/http';
import { hashPassword, signJWT, MIN_PASSWORD_LENGTH, MAX_PASSWORD_BYTES, sessionCookieOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  // 5 sign-ups per IP per hour blocks bulk account creation.
  const limited = tooManyRequests(req, 'register', 5, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await readJsonObject(req);
    if (!body) return badJson();
    const { password } = body;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' && body.phone.trim() ? body.phone.trim() : null;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required registration fields' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }
    if (name.length > 100 || (phone && phone.length > 20)) {
      return NextResponse.json({ error: 'Name or phone number is too long' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }, { status: 400 });
    }
    if (Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
      return NextResponse.json({ error: 'Password is too long' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        role: 'STUDENT',
      },
    });

    // No enrolment here: students are enrolled only after a successful payment.
    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `Welcome to CodeMyWay, ${name}! Enrol in a program to unlock your dashboard.`,
        isRead: false,
      },
    });

    // Sign JWT
    const token = await signJWT({ id: user.id, email: user.email, role: user.role, name: user.name });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('token', token, sessionCookieOptions());

    return response;
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
