import { createQuizAttemptSchema } from '@shared/schemas';
import { Router } from 'express';
import { validateBody } from '../../middleware/validate';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as quizController from './quizController';

export const quizRouter = Router();
quizRouter.use(verifyAccessToken);
quizRouter.post('/', validateBody(createQuizAttemptSchema), quizController.createAttempt);
quizRouter.get('/', quizController.listAttempts);
