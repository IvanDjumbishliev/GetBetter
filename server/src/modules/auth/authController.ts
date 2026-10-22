import { API_PREFIX, ERROR_CODES } from '@shared/constants';
import type { AuthResponse } from '@shared/types';
import type { CookieOptions, Request, Response } from 'express';
import { env } from '../../config/env';
import { AppError } from '../../lib/errors';
import * as authService from './authService';

export const REFRESH_COOKIE_NAME = 'refreshToken';

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  // Only sent to auth endpoints, never to the rest of the API.
  path: `${API_PREFIX}/auth`,
};

function sendSession(res: Response, status: number, result: authService.AuthResult) {
  res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
    ...refreshCookieOptions,
    expires: result.refreshTokenExpiresAt,
  });
  const body: AuthResponse = { user: result.user, accessToken: result.accessToken };
  res.status(status).json(body);
}

function readRefreshCookie(req: Request): string | undefined {
  const value: unknown = req.cookies?.[REFRESH_COOKIE_NAME];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export async function register(req: Request, res: Response) {
  sendSession(res, 201, await authService.register(req.body));
}

export async function login(req: Request, res: Response) {
  sendSession(res, 200, await authService.login(req.body));
}

export async function logout(req: Request, res: Response) {
  await authService.logout(readRefreshCookie(req));
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
  res.status(204).end();
}

export async function refreshToken(req: Request, res: Response) {
  const token = readRefreshCookie(req);
  if (!token) {
    throw new AppError(401, ERROR_CODES.INVALID_REFRESH_TOKEN, 'Missing refresh token');
  }
  try {
    const body: AuthResponse = await authService.refreshAccessToken(token);
    res.json(body);
  } catch (error) {
    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
    throw error;
  }
}

export async function me(req: Request, res: Response) {
  const user = req.user ? await authService.getUserById(req.user.id) : null;
  if (!user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'User no longer exists');
  }
  res.json({ user });
}
