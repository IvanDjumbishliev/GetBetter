import { postsQuerySchema } from '@shared/schemas';
import type { Request, Response } from 'express';
import { validateQuery } from '../../middleware/validate';
import { getAuthUserId } from '../auth/authMiddleware';
import * as communityService from './communityService';

type IdParams = { id: string };

export async function listPosts(req: Request, res: Response) {
  res.json(await communityService.listPosts(validateQuery(postsQuerySchema, req.query)));
}

export async function createPost(req: Request, res: Response) {
  res.status(201).json(await communityService.createPost(getAuthUserId(req), req.body));
}

export async function getPost(req: Request<IdParams>, res: Response) {
  res.json({ post: await communityService.getPost(req.params.id) });
}

export async function addComment(req: Request<IdParams>, res: Response) {
  res
    .status(201)
    .json(await communityService.addComment(req.params.id, getAuthUserId(req), req.body));
}

export async function deletePost(req: Request<IdParams>, res: Response) {
  await communityService.deletePost(req.params.id, getAuthUserId(req));
  res.status(204).end();
}

export async function deleteComment(req: Request<IdParams>, res: Response) {
  await communityService.deleteComment(req.params.id, getAuthUserId(req));
  res.status(204).end();
}
