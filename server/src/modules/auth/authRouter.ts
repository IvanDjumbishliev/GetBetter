import { loginSchema, registerSchema } from '@shared/schemas';
import { Router } from 'express';
import { validateBody } from '../../middleware/validate';
import * as authController from './authController';
import { verifyAccessToken } from './authMiddleware';

export const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), authController.register);
authRouter.post('/login', validateBody(loginSchema), authController.login);
authRouter.post('/logout', authController.logout);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.get('/me', verifyAccessToken, authController.me);
