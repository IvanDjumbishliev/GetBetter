import { Router } from 'express';
import { catchAsync } from '../../middleware/catchAsync';
import { validateBody } from '../../middleware/validate';
import { onboardingSchema } from '@shared/schemas';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as progressController from './progressController';

/** Routes about the current user, mounted at /me. */
export const meRouter = Router();
meRouter.use(verifyAccessToken);
meRouter.get('/stats', catchAsync(progressController.getStats));
meRouter.post(
  '/onboarding',
  validateBody(onboardingSchema),
  catchAsync(progressController.completeOnboarding),
);
