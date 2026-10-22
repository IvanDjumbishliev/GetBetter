import { createCommentSchema, createPostSchema } from '@shared/schemas';
import { Router } from 'express';
import { validateBody } from '../../middleware/validate';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as communityController from './communityController';

export const postsRouter = Router();
postsRouter.use(verifyAccessToken);
postsRouter.get('/', communityController.listPosts);
postsRouter.post('/', validateBody(createPostSchema), communityController.createPost);
postsRouter.get('/:id', communityController.getPost);
postsRouter.delete('/:id', communityController.deletePost);
postsRouter.post(
  '/:id/comments',
  validateBody(createCommentSchema),
  communityController.addComment,
);

export const commentsRouter = Router();
commentsRouter.use(verifyAccessToken);
commentsRouter.delete('/:id', communityController.deleteComment);
