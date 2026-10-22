import { API_PREFIX } from '@shared/constants';

// Empty VITE_API_URL means same-origin requests, which the Vite dev proxy forwards to the server.
const baseUrl = `${import.meta.env.VITE_API_URL ?? ''}${API_PREFIX}`;

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
