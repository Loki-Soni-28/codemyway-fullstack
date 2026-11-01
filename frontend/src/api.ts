// Thin client for the backend. Requests go to /api/* and are proxied to the
// backend by Vite in dev, so the auth cookie stays same-origin.
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((data as { error?: string }).error || `Request failed (${res.status})`, res.status);
  return data as T;
}
