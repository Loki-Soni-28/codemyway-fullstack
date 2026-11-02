// Thin client for the backend. Requests go to /api/* and are proxied to the
// backend by Vite in dev, so the auth cookie stays same-origin.
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export interface ApiRequestInit extends Omit<RequestInit, 'body'> {
  body?: any;
}

export async function api<T = unknown>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const isPlainObject =
    init.body !== null &&
    typeof init.body === 'object' &&
    !(init.body instanceof FormData) &&
    !(init.body instanceof Blob);

  const headers: Record<string, string> = {};
  if (isPlainObject || (typeof init.body === 'string' && init.body.trim().startsWith('{'))) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      ...headers,
      ...init.headers,
    },
    body: isPlainObject ? JSON.stringify(init.body) : init.body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((data as { error?: string }).error || `Request failed (${res.status})`, res.status);
  return data as T;
}
