import { Router } from 'express';
import { catchAsync } from '../../middleware/catchAsync';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as progressController from './progressController';

/** Routes about the current user, mounted at /me. */
export const meRouter = Router();
meRouter.use(verifyAccessToken);
meRouter.get('/stats', catchAsync(progressController.getStats));
