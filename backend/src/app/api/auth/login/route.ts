import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword, DUMMY_PASSWORD_HASH, signJWT, verifyGoogleIdToken } from '@/lib/auth';
import * as crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, email, password } = body;

    let user = null;

    if (type === 'credentials') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (typeof email !== 'string' || typeof password !== 'string') {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const { valid, needsRehash } = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);
      if (!user || !valid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      // Upgrade accounts still on the old SHA-256 hash.
      if (needsRehash) {
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: await hashPassword(password) },
        });
      }
    } else if (type === 'google') {
      const { credential } = body;
      if (!credential || typeof credential !== 'string') {
        return NextResponse.json({ error: 'Google credential is required' }, { status: 400 });
      }

      const googleUser = await verifyGoogleIdToken(credential);
      if (!googleUser) {
        return NextResponse.json({ error: 'Invalid Google sign-in' }, { status: 401 });
      }

      // The typed email must match the Google account. Mobile is only needed (and only
      // collected) when a new account is created at sign-up.
      const typedEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (!typedEmail) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }
      if (typedEmail !== googleUser.email) {
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
        // New accounts get an unguessable password; they sign in with Google only.
        // Enrol into the first published course so the student dashboard has data to show.
        const course = await prisma.course.findFirst({ where: { published: true }, orderBy: { createdAt: 'asc' } });
        const batch = course ? await prisma.batch.findFirst({ where: { courseId: course.id } }) : null;
        const mentor = await prisma.user.findFirst({ where: { role: 'MENTOR' } });
        user = await prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            passwordHash: await hashPassword(crypto.randomBytes(32).toString('hex')),
            role: 'STUDENT',
            phone,
            ...(course && {
              studentProfile: {
                create: { courseId: course.id, batchId: batch?.id ?? null, mentorId: mentor?.id ?? null },
              },
            }),
            notifications: {
              create: { message: `Welcome to CodeMyWay, ${googleUser.name}! Start exploring your dashboard and modules.`, isRead: false },
            },
          }
        });
      }
    } else {
      return NextResponse.json({ error: 'Invalid authentication type' }, { status: 400 });
    }

    // Sign JWT session
    const token = await signJWT({ id: user.id, email: user.email, role: user.role, name: user.name });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
