import { completeLessonSchema } from '@shared/schemas';
import { Router } from 'express';
import { catchAsync } from '../../middleware/catchAsync';
import { emptyBodySchema, validateBody } from '../../middleware/validate';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as lessonsController from './lessonsController';

export const topicsRouter = Router();
topicsRouter.use(verifyAccessToken);
topicsRouter.get('/', catchAsync(lessonsController.listTopics));
topicsRouter.get('/:slug', catchAsync(lessonsController.getTopic));
topicsRouter.post(
  '/:slug/enroll',
  validateBody(emptyBodySchema),
  catchAsync(lessonsController.enroll),
);

export const lessonsRouter = Router();
lessonsRouter.use(verifyAccessToken);
// Registered before "/:id" so "daily" isn't treated as a lesson id.
lessonsRouter.get('/daily', catchAsync(lessonsController.getDailyLesson));
lessonsRouter.get('/:id', catchAsync(lessonsController.getLesson));
lessonsRouter.post(
  '/:id/complete',
  validateBody(completeLessonSchema),
  catchAsync(lessonsController.completeLesson),
);
