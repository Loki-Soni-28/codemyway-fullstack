import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from './rateLimit';

// Parses a JSON object body; returns null for malformed JSON or non-object bodies,
// so routes can answer 400 instead of crashing into a 500.
export async function readJsonObject(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

export const badJson = () => NextResponse.json({ error: 'Invalid request body' }, { status: 400 });

// Returns a 429 response when the caller is over the limit, otherwise null.
export function tooManyRequests(req: Request, scope: string, limit: number, windowMs: number, key = clientIp(req)) {
  const result = rateLimit(`${scope}:${key}`, limit, windowMs);
  if (result.ok) return null;
  return NextResponse.json(
    { error: 'Too many requests. Please try again in a few minutes.' },
    { status: 429, headers: { 'Retry-After': String(result.retryAfter) } },
  );
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
