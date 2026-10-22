import type { HealthResponse } from '@shared/types';
import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
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
});
