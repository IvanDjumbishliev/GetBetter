import { completeLessonSchema } from '@shared/schemas';
import { Router } from 'express';
import { validateBody } from '../../middleware/validate';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as lessonsController from './lessonsController';

export const topicsRouter = Router();
topicsRouter.use(verifyAccessToken);
topicsRouter.get('/', lessonsController.listTopics);
topicsRouter.get('/:slug', lessonsController.getTopic);
topicsRouter.post('/:slug/enroll', lessonsController.enroll);

export const lessonsRouter = Router();
lessonsRouter.use(verifyAccessToken);
// Registered before "/:id" so "daily" isn't treated as a lesson id.
lessonsRouter.get('/daily', lessonsController.getDailyLesson);
lessonsRouter.get('/:id', lessonsController.getLesson);
lessonsRouter.post(
  '/:id/complete',
  validateBody(completeLessonSchema),
  lessonsController.completeLesson,
);
