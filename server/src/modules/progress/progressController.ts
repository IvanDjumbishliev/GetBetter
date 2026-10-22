import { statsQuerySchema } from '@shared/schemas';
import type { UserStats } from '@shared/types';
import type { Request, Response } from 'express';
import { validateQuery } from '../../middleware/validate';
import { getAuthUserId } from '../auth/authMiddleware';
import * as progressService from './progressService';

export async function getStats(req: Request, res: Response) {
  const query = validateQuery(statsQuerySchema, req.query);
  const body: UserStats = await progressService.getUserStats(getAuthUserId(req), query);
  res.json(body);
}
