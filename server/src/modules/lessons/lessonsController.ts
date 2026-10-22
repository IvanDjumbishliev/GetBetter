import { dailyLessonQuerySchema } from '@shared/schemas';
import type { DailyLessonResponse } from '@shared/types';
import type { Request, Response } from 'express';
import { getAuthUserId } from '../auth/authMiddleware';
import * as lessonService from './lessonService';
import { validateQuery } from '../../middleware/validate';

type SlugParams = { slug: string };
type IdParams = { id: string };

export async function listTopics(req: Request, res: Response) {
  res.json({ topics: await lessonService.listTopics(getAuthUserId(req)) });
}

export async function getTopic(req: Request<SlugParams>, res: Response) {
  res.json({ topic: await lessonService.getTopicBySlug(req.params.slug, getAuthUserId(req)) });
}

export async function enroll(req: Request<SlugParams>, res: Response) {
  const result = await lessonService.enroll(req.params.slug, getAuthUserId(req));
  res.status(result.alreadyEnrolled ? 200 : 201).json(result);
}

export async function getLesson(req: Request<IdParams>, res: Response) {
  res.json({ lesson: await lessonService.getLesson(req.params.id, getAuthUserId(req)) });
}

export async function completeLesson(req: Request<IdParams>, res: Response) {
  const result = await lessonService.completeLesson(
    req.params.id,
    getAuthUserId(req),
    req.body.timeZone,
  );
  res.status(result.alreadyCompleted ? 200 : 201).json(result);
}

export async function getDailyLesson(req: Request, res: Response) {
  const { timeZone } = validateQuery(dailyLessonQuerySchema, req.query);
  const body: DailyLessonResponse = {
    dailyLesson: await lessonService.getDailyLesson(getAuthUserId(req), timeZone),
  };
  res.json(body);
}
