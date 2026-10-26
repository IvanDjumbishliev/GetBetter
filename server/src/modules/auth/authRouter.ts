import { loginSchema, registerSchema } from '@shared/schemas';
import { Router } from 'express';
import { catchAsync } from '../../middleware/catchAsync';
import { emptyBodySchema, validateBody } from '../../middleware/validate';
import * as authController from './authController';
import { verifyAccessToken } from './authMiddleware';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), catchAsync(authController.register));
authRouter.post('/login', validateBody(loginSchema), catchAsync(authController.login));
authRouter.post('/logout', validateBody(emptyBodySchema), catchAsync(authController.logout));
authRouter.post(
  '/refresh-token',
  validateBody(emptyBodySchema),
  catchAsync(authController.refreshToken),
);
authRouter.get('/me', verifyAccessToken, catchAsync(authController.me));
