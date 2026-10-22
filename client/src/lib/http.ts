import { API_PREFIX } from '@shared/constants';
import axios, { type InternalAxiosRequestConfig } from 'axios';

// Empty VITE_API_URL means same-origin requests, which the Vite dev proxy forwards to the server.
export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ''}${API_PREFIX}`,
  withCredentials: true,
});

interface AuthHandlers {
  getAccessToken: () => string | null;
  /** Resolves to a fresh access token, or null if the session can't be refreshed. */
  refreshAccessToken: () => Promise<string | null>;
}

// Registered by the auth store, so this module doesn't import it (avoids a circular dependency).
let authHandlers: AuthHandlers | null = null;

export function registerAuthHandlers(handlers: AuthHandlers) {
  authHandlers = handlers;
}

// A 401 from these means bad credentials or a dead session, not an expired access token.
const NO_REFRESH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh-token', '/auth/logout'];

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

http.interceptors.request.use((config) => {
  const token = authHandlers?.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error) || !authHandlers) throw error;

  const config = error.config as RetriableConfig | undefined;
  const shouldRefresh =
    error.response?.status === 401 &&
    config &&
    !config._retried &&
    !NO_REFRESH_PATHS.some((path) => config.url?.startsWith(path));
  if (!shouldRefresh) throw error;

  config._retried = true;
  const token = await authHandlers.refreshAccessToken();
  if (!token) throw error;

  // The request interceptor attaches the new token.
  return http(config);
});
