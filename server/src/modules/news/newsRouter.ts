import { Router } from 'express';
import { catchAsync } from '../../middleware/catchAsync';
import { verifyAccessToken } from '../auth/authMiddleware';
import { listNews } from './newsController';

export const newsRouter = Router();
newsRouter.use(verifyAccessToken);
newsRouter.get('/', catchAsync(listNews));
