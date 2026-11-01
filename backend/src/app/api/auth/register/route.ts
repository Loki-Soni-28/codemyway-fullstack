import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signJWT, MIN_PASSWORD_LENGTH, MAX_PASSWORD_BYTES, sessionCookieOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, phone } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required registration fields' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }, { status: 400 });
    }
    if (Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
      return NextResponse.json({ error: 'Password is too long' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
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
