import type { Request, Response } from 'express';
import { validateQuery } from '../../middleware/validate';
import { z } from 'zod';
import { fetchNewsForTopic } from './newsService';

const newsQuerySchema = z.object({
  topic: z.string().trim().min(1).default('technology'),
  limit: z.coerce.number().int().min(1).max(12).default(6),
});

export async function listNews(req: Request, res: Response) {
  const { topic, limit } = validateQuery(newsQuerySchema, req.query);
  const news = await fetchNewsForTopic(topic, limit);
  res.json({ news });
}
