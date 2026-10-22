import { Router } from 'express';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as progressController from './progressController';

/** Routes about the current user, mounted at /me. */
export const meRouter = Router();
meRouter.use(verifyAccessToken);
meRouter.get('/stats', progressController.getStats);
