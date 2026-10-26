import { Router } from 'express';
import { catchAsync } from '../../middleware/catchAsync';
import { emptyBodySchema, validateBody } from '../../middleware/validate';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as notificationController from './notificationController';

export const notificationRouter = Router();
notificationRouter.use(verifyAccessToken);
notificationRouter.get('/', catchAsync(notificationController.list));
notificationRouter.patch(
  '/read-all',
  validateBody(emptyBodySchema),
  catchAsync(notificationController.markAllRead),
);
