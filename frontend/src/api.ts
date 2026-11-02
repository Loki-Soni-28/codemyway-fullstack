// Thin client for the backend. Requests go to /api/* and are proxied to the
// backend by Vite in dev, so the auth cookie stays same-origin.
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type ApiInit = Omit<RequestInit, 'body'> & { body?: BodyInit | object | null };

export async function api<T = unknown>(path: string, init: ApiInit = {}): Promise<T> {
  // Plain objects are sent as JSON; strings, FormData, etc. pass through untouched.
  const isPlainObject = typeof init.body === 'object' && init.body !== null
    && Object.getPrototypeOf(init.body) === Object.prototype;
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    body: isPlainObject ? JSON.stringify(init.body) : (init.body as BodyInit | null | undefined),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((data as { error?: string }).error || `Request failed (${res.status})`, res.status);
  return data as T;
}
