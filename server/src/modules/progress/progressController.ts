import { statsQuerySchema } from '@shared/schemas';
import type { UserStats } from '@shared/types';
import type { Request, Response } from 'express';
import { onboardingSchema } from '@shared/schemas';
import { getCached, getCacheVersion, invalidateCacheVersion } from '../../lib/cache';
import { parseOrThrow, validateQuery } from '../../middleware/validate';
import { getAuthUserId } from '../auth/authMiddleware';
import * as progressService from './progressService';
import * as onboardingService from './onboardingService';

export async function getStats(req: Request, res: Response) {
  const query = validateQuery(statsQuerySchema, req.query);
  const userId = getAuthUserId(req);
  const version = await getCacheVersion(`cache-version:stats:${userId}`);
  const cacheKey = `stats:${userId}:${version}:${query.timeZone ?? 'UTC'}:${query.days}`;
  const body: UserStats = await getCached(cacheKey, () =>
    progressService.getUserStats(userId, query),
  );
  res.json(body);
}

export async function completeOnboarding(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const input = parseOrThrow(onboardingSchema, req.body);
  const result = await onboardingService.completeOnboarding(userId, input);
  await Promise.all([
    invalidateCacheVersion('cache-version:topics'),
    invalidateCacheVersion(`cache-version:stats:${userId}`),
  ]);
  res.status(201).json(result);
}
