import type { HealthResponse } from '@shared/types';
import { Router } from 'express';
import { catchAsync } from '../middleware/catchAsync';
import { prisma } from '../lib/prisma';

export const healthRouter = Router();

healthRouter.get(
  '/',
  catchAsync(async (_req, res) => {
    let database: HealthResponse['database'] = 'up';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'down';
    }

    const body: HealthResponse = {
      status: 'ok',
      message: 'Hello World from the GetBetter API',
      database,
      timestamp: new Date().toISOString(),
    };
    res.json(body);
  }),
);
