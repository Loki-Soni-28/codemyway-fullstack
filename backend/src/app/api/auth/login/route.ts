import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signJWT, verifyGoogleIdToken, sessionCookieOptions } from '@/lib/auth';
import * as crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    let user = null;

    if (type === 'google') {
      const { credential } = body;
      if (!credential || typeof credential !== 'string') {
        return NextResponse.json({ error: 'Google credential is required' }, { status: 400 });
      }

      const googleUser = await verifyGoogleIdToken(credential);
      if (!googleUser) {
        return NextResponse.json({ error: 'Invalid Google sign-in' }, { status: 401 });
      }

      // The email comes from the verified Google account; if a client still sends one it must
      // match. Mobile is only needed (and only collected) when a new account is created at sign-up.
      const typedEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (typedEmail && typedEmail !== googleUser.email) {
        return NextResponse.json({ error: `The Google account (${googleUser.email}) doesn't match the email you entered.` }, { status: 400 });
      }

      user = await prisma.user.findUnique({ where: { email: googleUser.email } });

      const rawPhone = typeof body.phone === 'string' ? body.phone.replace(/[\s\-+()]/g, '') : '';
      const phone = rawPhone.replace(/^(91|0)(?=\d{10}$)/, '');
      const validPhone = /^[6-9]\d{9}$/.test(phone);

      if (!user) {
        if (!validPhone) {
          return NextResponse.json({ error: 'No account found for this email. Please sign up with your mobile number first.' }, { status: 404 });
        }
        const phoneVariants = [phone, `+91${phone}`, `91${phone}`, `+91 ${phone}`];
        const phoneTaken = await prisma.user.findFirst({ where: { phone: { in: phoneVariants } } });
        if (phoneTaken) {
          return NextResponse.json({ error: 'This mobile number is already linked to another account.' }, { status: 409 });
        }
      }

      if (!user) {
        // New accounts get an unguessable password and sign in with Google only. They are
        // enrolled only once a payment succeeds (see lib/enrollment.ts).
        user = await prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            passwordHash: await hashPassword(crypto.randomBytes(32).toString('hex')),
            role: 'STUDENT',
            phone,
            notifications: {
              create: { message: `Welcome to CodeMyWay, ${googleUser.name}! Enrol in a program to unlock your dashboard.`, isRead: false },
            },
          }
        });
      }
    } else {
      return NextResponse.json({ error: 'Invalid authentication type' }, { status: 400 });
    }

    const enrolment = await prisma.studentProfile.findUnique({ where: { userId: user.id }, select: { id: true } });

    // Sign JWT session
    const token = await signJWT({ id: user.id, email: user.email, role: user.role, name: user.name });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        enrolled: !!enrolment,
      }
    });

    // Set cookie
    response.cookies.set('token', token, sessionCookieOptions());

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
