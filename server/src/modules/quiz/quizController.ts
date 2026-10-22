import { quizAttemptsQuerySchema } from '@shared/schemas';
import type { QuizAttemptsResponse } from '@shared/types';
import type { Request, Response } from 'express';
import { validateQuery } from '../../middleware/validate';
import { getAuthUserId } from '../auth/authMiddleware';
import * as quizService from './quizService';

export async function createAttempt(req: Request, res: Response) {
  res.status(201).json(await quizService.createAttempt(getAuthUserId(req), req.body));
}

export async function listAttempts(req: Request, res: Response) {
  const { lessonId } = validateQuery(quizAttemptsQuerySchema, req.query);
  const body: QuizAttemptsResponse = {
    attempts: await quizService.listAttempts(getAuthUserId(req), lessonId),
  };
  res.json(body);
}
