import { NextResponse } from 'next/server';
import { getSessionUser, signJWT, sessionCookieOptions } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const response = NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      enrolled: !!user.studentProfile,
      studentProfile: user.studentProfile,
    },
  });

  // Sliding session: each check extends the login for another SESSION_DAYS.
  const token = await signJWT({ id: user.id, email: user.email, role: user.role, name: user.name });
  response.cookies.set('token', token, sessionCookieOptions());
  return response;
}
