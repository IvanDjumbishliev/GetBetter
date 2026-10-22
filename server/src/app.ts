import { API_PREFIX } from '@shared/constants';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './modules/auth/authRouter';
import { lessonsRouter, topicsRouter } from './modules/lessons/lessonsRouter';
import { meRouter } from './modules/progress/progressRouter';
import { quizRouter } from './modules/quiz/quizRouter';
import { healthRouter } from './routes/health';

export const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/topics`, topicsRouter);
app.use(`${API_PREFIX}/lessons`, lessonsRouter);
app.use(`${API_PREFIX}/quiz-attempts`, quizRouter);
app.use(`${API_PREFIX}/me`, meRouter);

app.use(notFoundHandler);
app.use(errorHandler);
