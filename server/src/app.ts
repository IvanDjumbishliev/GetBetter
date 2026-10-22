import { API_PREFIX } from '@shared/constants';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './modules/auth/authRouter';
import { healthRouter } from './routes/health';

export const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}/auth`, authRouter);

app.use(notFoundHandler);
app.use(errorHandler);
