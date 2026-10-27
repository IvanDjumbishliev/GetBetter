import { API_PREFIX } from '@shared/constants';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './modules/auth/authRouter';
import { commentsRouter, postsRouter } from './modules/community/communityRouter';
import { lessonsRouter, topicsRouter } from './modules/lessons/lessonsRouter';
import { meRouter } from './modules/progress/progressRouter';
import { notificationRouter } from './modules/notifications/notificationRouter';
import { quizRouter } from './modules/quiz/quizRouter';
import { healthRouter } from './routes/health';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: () => env.NODE_ENV === 'test',
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/topics`, topicsRouter);
app.use(`${API_PREFIX}/lessons`, lessonsRouter);
app.use(`${API_PREFIX}/quiz-attempts`, quizRouter);
app.use(`${API_PREFIX}/me`, meRouter);
app.use(`${API_PREFIX}/notifications`, notificationRouter);
app.use(`${API_PREFIX}/posts`, postsRouter);
app.use(`${API_PREFIX}/comments`, commentsRouter);

if (env.NODE_ENV === 'production') {
  const clientDistPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../client/dist');
  const clientIndexPath = resolve(clientDistPath, 'index.html');

  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (
      req.method !== 'GET' ||
      req.path === API_PREFIX ||
      req.path.startsWith(`${API_PREFIX}/`) ||
      !req.accepts('html')
    ) {
      next();
      return;
    }

    res.sendFile(clientIndexPath, (error) => {
      if (error) next(error);
    });
  });
}

app.use(notFoundHandler);
app.use(errorHandler);
