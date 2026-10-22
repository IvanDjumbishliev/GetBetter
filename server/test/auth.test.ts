import { ERROR_CODES } from '@shared/constants';
import request, { type Response } from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';

const credentials = {
  email: 'ada@example.com',
  password: 'correct-horse-battery',
  displayName: 'Ada Lovelace',
};

function getRefreshCookie(res: Response): string | undefined {
  const header = res.headers['set-cookie'] as string[] | string | undefined;
  const cookies = Array.isArray(header) ? header : header ? [header] : [];
  return cookies.find(
    (cookie) => cookie.startsWith('refreshToken=') && !cookie.startsWith('refreshToken=;'),
  );
}

/** "refreshToken=abc; Path=...; HttpOnly" -> "refreshToken=abc" */
const cookiePair = (cookie: string) => cookie.split(';')[0]!;

const register = (body: object = credentials) => request(app).post('/api/auth/register').send(body);
const login = (body: object) => request(app).post('/api/auth/login').send(body);

function expectError(res: Response, status: number, code: string) {
  expect(res.status).toBe(status);
  expect(res.body).toEqual({
    error: expect.objectContaining({ code, message: expect.any(String) }),
  });
}

describe('POST /api/auth/register', () => {
  it('creates a user, returns an access token and sets an httpOnly refresh cookie', async () => {
    const res = await register({ ...credentials, email: '  Ada@Example.COM ' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      user: {
        id: expect.any(String),
        email: 'ada@example.com',
        displayName: 'Ada Lovelace',
        avatarUrl: null,
        role: 'USER',
      },
      accessToken: expect.any(String),
    });
    expect(res.body.user).not.toHaveProperty('passwordHash');

    const cookie = getRefreshCookie(res);
    expect(cookie).toBeDefined();
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/Path=\/api\/auth/);
    expect(cookie).toMatch(/SameSite=Strict/);

    const stored = await prisma.user.findUniqueOrThrow({ where: { email: 'ada@example.com' } });
    expect(stored.passwordHash).not.toBe(credentials.password);
  });

  it('rejects a duplicate email with EMAIL_TAKEN', async () => {
    await register().expect(201);

    const res = await register({ ...credentials, email: 'ADA@example.com' });

    expectError(res, 409, ERROR_CODES.EMAIL_TAKEN);
    expect(await prisma.user.count()).toBe(1);
  });

  it('rejects invalid input with VALIDATION_ERROR', async () => {
    const res = await register({ email: 'not-an-email', password: 'short', displayName: '' });

    expectError(res, 400, ERROR_CODES.VALIDATION_ERROR);
    expect(res.body.error.details.map((d: { path: string }) => d.path).sort()).toEqual([
      'displayName',
      'email',
      'password',
    ]);
  });
});

describe('POST /api/auth/login', () => {
  it('returns the user, an access token and a refresh cookie', async () => {
    await register().expect(201);

    const res = await login({ email: credentials.email, password: credentials.password });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(credentials.email);
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(getRefreshCookie(res)).toBeDefined();

    await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${res.body.accessToken}`)
      .expect(200);
  });

  it('rejects a wrong password with INVALID_CREDENTIALS', async () => {
    await register().expect(201);

    const res = await login({ email: credentials.email, password: 'wrong-password' });

    expectError(res, 401, ERROR_CODES.INVALID_CREDENTIALS);
    expect(getRefreshCookie(res)).toBeUndefined();
  });

  it('rejects an unknown email with the same INVALID_CREDENTIALS error', async () => {
    const res = await login({ email: 'nobody@example.com', password: 'whatever-password' });

    expectError(res, 401, ERROR_CODES.INVALID_CREDENTIALS);
  });
});

describe('POST /api/auth/refresh-token', () => {
  it('issues a new working access token from the refresh cookie', async () => {
    const registered = await register().expect(201);
    const cookie = cookiePair(getRefreshCookie(registered)!);

    const res = await request(app).post('/api/auth/refresh-token').set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      user: expect.objectContaining({ email: credentials.email }),
      accessToken: expect.any(String),
    });

    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${res.body.accessToken}`);
    expect(me.status).toBe(200);
    expect(me.body.user.id).toBe(registered.body.user.id);
  });

  it('rejects a request without a refresh cookie', async () => {
    const res = await request(app).post('/api/auth/refresh-token');

    expectError(res, 401, ERROR_CODES.INVALID_REFRESH_TOKEN);
  });

  it('rejects a tampered refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .set('Cookie', 'refreshToken=not.a.jwt');

    expectError(res, 401, ERROR_CODES.INVALID_REFRESH_TOKEN);
  });

  it('rejects a refresh token after logout', async () => {
    const registered = await register().expect(201);
    const cookie = cookiePair(getRefreshCookie(registered)!);

    await request(app).post('/api/auth/logout').set('Cookie', cookie).expect(204);
    const res = await request(app).post('/api/auth/refresh-token').set('Cookie', cookie);

    expectError(res, 401, ERROR_CODES.INVALID_REFRESH_TOKEN);
  });
});

describe('verifyAccessToken', () => {
  it('rejects requests without a bearer token', async () => {
    const res = await request(app).get('/api/auth/me');

    expectError(res, 401, ERROR_CODES.UNAUTHORIZED);
  });

  it('rejects an invalid bearer token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer garbage');

    expectError(res, 401, ERROR_CODES.INVALID_TOKEN);
  });
});
