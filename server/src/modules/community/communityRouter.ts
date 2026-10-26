import { createCommentSchema, createPostSchema } from '@shared/schemas';
import { Router } from 'express';
import { catchAsync } from '../../middleware/catchAsync';
import { validateBody } from '../../middleware/validate';
import { verifyAccessToken } from '../auth/authMiddleware';
import * as communityController from './communityController';

export const postsRouter = Router();
postsRouter.use(verifyAccessToken);
postsRouter.get('/', catchAsync(communityController.listPosts));
postsRouter.post('/', validateBody(createPostSchema), catchAsync(communityController.createPost));
postsRouter.get('/:id', catchAsync(communityController.getPost));
postsRouter.delete('/:id', catchAsync(communityController.deletePost));
postsRouter.post(
  '/:id/comments',
  validateBody(createCommentSchema),
  catchAsync(communityController.addComment),
);

export const commentsRouter = Router();
commentsRouter.use(verifyAccessToken);
commentsRouter.delete('/:id', catchAsync(communityController.deleteComment));
