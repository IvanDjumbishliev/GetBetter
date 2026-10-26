import { ERROR_CODES, POST_EXCERPT_LENGTH } from '@shared/constants';
import type { CreateCommentInput, CreatePostInput, PostsQuery } from '@shared/schemas';
import { toPlainTextExcerpt } from '@shared/text';
import type { PostAuthor, PostComment, PostDetail, PostsPage, PostSummary } from '@shared/types';
import { Prisma } from '@prisma/client';
import { AppError } from '../../lib/errors';
import { prisma } from '../../lib/prisma';

const authorSelect = { select: { id: true, displayName: true, avatarUrl: true } } as const;
const topicSelect = { select: { id: true, slug: true, title: true, categoryId: true } } as const;

const postInclude = {
  user: authorSelect,
  topic: topicSelect,
  _count: { select: { comments: true } },
} satisfies Prisma.CommunityPostInclude;

type PostRow = Prisma.CommunityPostGetPayload<{ include: typeof postInclude }>;

const notFound = (what: string) => new AppError(404, ERROR_CODES.NOT_FOUND, `${what} not found`);
const forbidden = (message: string) => new AppError(403, ERROR_CODES.FORBIDDEN, message);

const toAuthor = (user: PostAuthor): PostAuthor => ({
  id: user.id,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl,
});

function toPostSummary(post: PostRow): PostSummary {
  return {
    id: post.id,
    title: post.title,
    excerpt: toPlainTextExcerpt(post.body, POST_EXCERPT_LENGTH),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    commentCount: post._count.comments,
    author: toAuthor(post.user),
    topic: post.topic,
  };
}

function toPostComment(comment: {
  id: string;
  postId: string;
  body: string;
  createdAt: Date;
  user: PostAuthor;
}): PostComment {
  return {
    id: comment.id,
    postId: comment.postId,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
    author: toAuthor(comment.user),
  };
}

/** Throws FORBIDDEN unless the user is the owner or an admin. Role is read fresh from the DB. */
async function assertCanModerate(userId: string, ownerId: string, what: string) {
  if (userId === ownerId) return;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'ADMIN') {
    throw forbidden(`Only the author or an admin can delete this ${what}`);
  }
}

export async function listPosts({
  topicId,
  categoryId,
  page,
  limit,
}: PostsQuery): Promise<PostsPage> {
  const where: Prisma.CommunityPostWhereInput = topicId
    ? { topicId }
    : categoryId
      ? { topic: { categoryId } }
      : {};

  const [total, posts] = await prisma.$transaction([
    prisma.communityPost.count({ where }),
    prisma.communityPost.findMany({
      where,
      include: postInclude,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    posts: posts.map(toPostSummary),
    page,
    limit,
    total,
    hasMore: page * limit < total,
  };
}

export async function createPost(userId: string, input: CreatePostInput): Promise<PostSummary> {
  if (input.topicId) {
    const topic = await prisma.topic.findUnique({
      where: { id: input.topicId },
      select: { id: true },
    });
    if (!topic) throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Topic does not exist');
  }
  const post = await prisma.communityPost.create({
    data: { userId, topicId: input.topicId ?? null, title: input.title, body: input.body },
    include: postInclude,
  });
  return toPostSummary(post);
}

export async function getPost(id: string): Promise<PostDetail> {
  const post = await prisma.communityPost.findUnique({
    where: { id },
    include: {
      ...postInclude,
      comments: { include: { user: authorSelect }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] },
    },
  });
  if (!post) throw notFound('Post');

  const { excerpt: _excerpt, ...summary } = toPostSummary(post);
  return { ...summary, body: post.body, comments: post.comments.map(toPostComment) };
}

export async function addComment(
  postId: string,
  userId: string,
  input: CreateCommentInput,
): Promise<PostComment> {
  return prisma.$transaction(async (tx) => {
    const post = await tx.communityPost.findUnique({
      where: { id: postId },
      select: { userId: true, title: true },
    });
    if (!post) throw notFound('Post');

    const comment = await tx.comment.create({
      data: { postId, userId, body: input.body },
      include: { user: authorSelect },
    });
    if (post.userId !== userId) {
      await tx.notification.create({
        data: {
          userId: post.userId,
          type: 'NEW_REPLY',
          message: `${comment.user.displayName} replied to your post "${post.title}"`,
          dedupeKey: `new-reply:${comment.id}`,
        },
      });
    }
    return toPostComment(comment);
  });
}

export async function deletePost(id: string, userId: string): Promise<void> {
  const post = await prisma.communityPost.findUnique({ where: { id }, select: { userId: true } });
  if (!post) throw notFound('Post');
  await assertCanModerate(userId, post.userId, 'post');
  // Comments are removed by the ON DELETE CASCADE foreign key.
  await prisma.communityPost.deleteMany({ where: { id } });
}

export async function deleteComment(id: string, userId: string): Promise<void> {
  const comment = await prisma.comment.findUnique({ where: { id }, select: { userId: true } });
  if (!comment) throw notFound('Comment');
  await assertCanModerate(userId, comment.userId, 'comment');
  await prisma.comment.deleteMany({ where: { id } });
}
