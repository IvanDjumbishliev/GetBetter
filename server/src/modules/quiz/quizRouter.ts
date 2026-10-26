import { createQuizAttemptSchema } from '@shared/schemas';
import { Router } from 'express';
import { catchAsync } from '../../middleware/catchAsync';
import { validateBody } from '../../middleware/validate';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as quizController from './quizController';

export const quizRouter = Router();
quizRouter.use(verifyAccessToken);
quizRouter.post(
  '/',
  validateBody(createQuizAttemptSchema),
  catchAsync(quizController.createAttempt),
);
quizRouter.get('/', catchAsync(quizController.listAttempts));
