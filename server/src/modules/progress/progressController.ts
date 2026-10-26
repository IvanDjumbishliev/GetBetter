import { statsQuerySchema } from '@shared/schemas';
import type { UserStats } from '@shared/types';
import type { Request, Response } from 'express';
import { getCached, getCacheVersion } from '../../lib/cache';
import { validateQuery } from '../../middleware/validate';
import { getAuthUserId } from '../auth/authMiddleware';
import * as progressService from './progressService';

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
