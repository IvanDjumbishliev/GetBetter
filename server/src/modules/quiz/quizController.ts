import { quizAttemptsQuerySchema } from '@shared/schemas';
import type { QuizAttemptsResponse } from '@shared/types';
import type { Request, Response } from 'express';
import { validateQuery } from '../../middleware/validate';
import { invalidateCacheVersion } from '../../lib/cache';
import { getAuthUserId } from '../auth/authMiddleware';
import * as quizService from './quizService';

export async function createAttempt(req: Request, res: Response) {
  const userId = getAuthUserId(req);
  const result = await quizService.createAttempt(userId, req.body);
  await invalidateCacheVersion(`cache-version:stats:${userId}`);
  res.status(201).json(result);
}

export async function listAttempts(req: Request, res: Response) {
  const { lessonId } = validateQuery(quizAttemptsQuerySchema, req.query);
  const body: QuizAttemptsResponse = {
    attempts: await quizService.listAttempts(getAuthUserId(req), lessonId),
  };
  res.json(body);
}
