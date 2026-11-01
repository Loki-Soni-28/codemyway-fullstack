import { SignJWT, jwtVerify, createRemoteJWKSet } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './db';
import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Resolved lazily so `next build` works without runtime secrets, but any request
// that signs or verifies a token fails loudly if JWT_SECRET is missing or weak.
let cachedSecret: Uint8Array | null = null;
function getJwtSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set. Add a long random value to the environment.');
  }
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }
  cachedSecret = new TextEncoder().encode(secret);
  return cachedSecret;
}

const BCRYPT_COST = 12;
export const MIN_PASSWORD_LENGTH = 8;
// bcrypt only uses the first 72 bytes of its input.
export const MAX_PASSWORD_BYTES = 72;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

const isBcryptHash = (hash: string) => /^\$2[aby]\$/.test(hash);

// Accounts created before bcrypt was introduced store an unsalted SHA-256 hex digest.
// They still verify, and `needsRehash` tells the caller to upgrade them after login.
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<{ valid: boolean; needsRehash: boolean }> {
  if (isBcryptHash(storedHash)) {
    return { valid: await bcrypt.compare(password, storedHash), needsRehash: false };
  }

  const legacy = crypto.createHash('sha256').update(password).digest('hex');
  const a = Buffer.from(legacy);
  const b = Buffer.from(storedHash);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  return { valid, needsRehash: valid };
}

// Used when no account matches, so unknown emails cost the same time as wrong passwords.
export const DUMMY_PASSWORD_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_COST);

// Students stay signed in until they log out. The cookie is re-issued whenever the app
// checks the session (see /api/auth/me), so regular visitors never expire.
export const SESSION_DAYS = 30;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: '/',
  };
}

export async function signJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getJwtSecret());
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const payload = await verifyJWT(token);
    if (!payload || !payload.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      include: {
        studentProfile: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    classes: true
                  }
                }
              }
            },
            batch: true,
            mentor: true,
          }
        }
      }
    });

    return user;
  } catch (e) {
    return null;
  }
}

const googleJwks = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

// Verifies a Google Sign-In ID token (signature, issuer, audience, expiry).
// Returns null if GOOGLE_CLIENT_ID is unset or the token is invalid.
export async function verifyGoogleIdToken(idToken: string): Promise<{ email: string; name: string } | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return null;

  try {
    const { payload } = await jwtVerify(idToken, googleJwks, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: clientId,
    });
    if (payload.email_verified !== true || typeof payload.email !== 'string') return null;
    return {
      email: payload.email.toLowerCase(),
      name: typeof payload.name === 'string' && payload.name ? payload.name : payload.email.split('@')[0],
    };
  } catch {
    return null;
  }
}
