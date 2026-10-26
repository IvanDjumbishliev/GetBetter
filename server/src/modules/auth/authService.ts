import { ERROR_CODES } from '@shared/constants';
import type { LoginInput, RegisterInput } from '@shared/schemas';
import type { AuthUser } from '@shared/types';
import { Prisma, type User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { env } from '../../config/env';
import { AppError } from '../../lib/errors';
import { prisma } from '../../lib/prisma';

// Low cost in tests keeps the suite fast; 12 is a sensible production default.
const BCRYPT_ROUNDS = env.NODE_ENV === 'test' ? 4 : 12;
const JWT_ALGORITHM = 'HS256';

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

const invalidCredentials = () =>
  new AppError(401, ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password');

const invalidRefreshToken = () =>
  new AppError(401, ERROR_CODES.INVALID_REFRESH_TOKEN, 'Refresh token is invalid or expired');

// Compared against when the email doesn't exist, so response time doesn't reveal which emails are registered.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hash('not-a-real-password', BCRYPT_ROUNDS));

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    onboardingCompletedAt: user.onboardingCompletedAt?.toISOString() ?? null,
    dailyGoalMinutes: user.dailyGoalMinutes,
    reminderTime: user.reminderTime,
    preferredTimeZone: user.preferredTimeZone,
  };
}

export function signAccessToken(user: Pick<User, 'id' | 'email'>): string {
  return jwt.sign({ email: user.email }, env.ACCESS_TOKEN_SECRET, {
    subject: user.id,
    algorithm: JWT_ALGORITHM,
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

export function verifyAccessTokenString(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET, {
    algorithms: [JWT_ALGORITHM],
  }) as JwtPayload;
  if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
    throw new jwt.JsonWebTokenError('Malformed access token payload');
  }
  return { sub: payload.sub, email: payload.email };
}

async function issueRefreshToken(userId: string) {
  const jti = randomUUID();
  const refreshToken = jwt.sign({}, env.REFRESH_TOKEN_SECRET, {
    subject: userId,
    jwtid: jti,
    algorithm: JWT_ALGORITHM,
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  });
  const { exp } = jwt.decode(refreshToken) as JwtPayload;
  const refreshTokenExpiresAt = new Date(exp! * 1000);

  await prisma.refreshToken.create({
    data: { id: jti, userId, expiresAt: refreshTokenExpiresAt },
  });
  return { refreshToken, refreshTokenExpiresAt };
}

async function createSession(user: User): Promise<AuthResult> {
  return {
    user: toAuthUser(user),
    accessToken: signAccessToken(user),
    ...(await issueRefreshToken(user.id)),
  };
}

function decodeRefreshToken(token: string): { userId: string; jti: string } | null {
  try {
    const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET, {
      algorithms: [JWT_ALGORITHM],
    }) as JwtPayload;
    if (typeof payload.sub !== 'string' || typeof payload.jti !== 'string') return null;
    return { userId: payload.sub, jti: payload.jti };
  } catch {
    return null;
  }
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  try {
    const user = await prisma.user.create({
      data: { email: input.email, displayName: input.displayName, passwordHash },
    });
    return await createSession(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError(409, ERROR_CODES.EMAIL_TAKEN, 'An account with this email already exists');
    }
    throw error;
  }
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    await bcrypt.compare(input.password, await getDummyHash());
    throw invalidCredentials();
  }
  if (!(await bcrypt.compare(input.password, user.passwordHash))) {
    throw invalidCredentials();
  }
  return createSession(user);
}

/** Validates a refresh token against its stored session and issues a new access token. */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<{ user: AuthUser; accessToken: string }> {
  const decoded = decodeRefreshToken(refreshToken);
  if (!decoded) throw invalidRefreshToken();

  const session = await prisma.refreshToken.findUnique({
    where: { id: decoded.jti },
    include: { user: true },
  });
  if (
    !session ||
    session.userId !== decoded.userId ||
    session.revokedAt ||
    session.expiresAt <= new Date()
  ) {
    throw invalidRefreshToken();
  }

  return { user: toAuthUser(session.user), accessToken: signAccessToken(session.user) };
}

/** Revokes the session behind a refresh token. Invalid or unknown tokens are ignored. */
export async function logout(refreshToken: string | undefined): Promise<void> {
  const decoded = refreshToken ? decodeRefreshToken(refreshToken) : null;
  if (!decoded) return;
  await prisma.refreshToken.updateMany({
    where: { id: decoded.jti, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toAuthUser(user) : null;
}
