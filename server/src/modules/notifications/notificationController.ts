import type { Request, Response } from 'express';
import { getAuthUserId } from '../auth/authMiddleware';
import * as notificationService from './notificationService';

export async function list(req: Request, res: Response) {
  res.json(await notificationService.listNotifications(getAuthUserId(req)));
}

export async function markAllRead(req: Request, res: Response) {
  await notificationService.markAllRead(getAuthUserId(req));
  res.status(204).end();
}
