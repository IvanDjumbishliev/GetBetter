import { ERROR_CODES } from '@shared/constants';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { auth, createTopic, createUser } from './fixtures';

async function createAdmin() {
  const admin = await createUser();
  await prisma.user.update({ where: { id: admin.id }, data: { role: 'ADMIN' } });
  return admin;
}

/** Inserts posts directly, `minutesApart` apart, newest last. */
async function seedPosts(userId: string, count: number, topicId: string | null = null) {
  const start = Date.now() - count * 60_000;
  await prisma.communityPost.createMany({
    data: Array.from({ length: count }, (_, i) => ({
      userId,
      topicId,
      title: `Post ${i + 1}`,
      body: `Body ${i + 1}`,
      createdAt: new Date(start + i * 60_000),
    })),
  });
}

const createPost = (token: string, body: object) =>
  request(app).post('/api/posts').set(auth(token)).send(body);

describe('community routes', () => {
  it('require authentication', async () => {
    await request(app).get('/api/posts').expect(401);
    await request(app).post('/api/posts').send({}).expect(401);
    await request(app).delete('/api/comments/x').expect(401);
  });
});

describe('POST /api/posts', () => {
  it('creates a post with a topic and returns its summary', async () => {
    const user = await createUser();
    const topic = await createTopic();

    const res = await createPost(user.token, {
      topicId: topic.id,
      title: '  How do I start?  ',
      body: '**Help** me pick a first lesson',
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: 'How do I start?',
      excerpt: 'Help me pick a first lesson',
      commentCount: 0,
      author: { id: user.id, displayName: 'Tester' },
      topic: { id: topic.id, slug: topic.slug, categoryId: topic.categoryId },
    });
    expect(res.body.author).not.toHaveProperty('email');
  });

  it('allows posts without a topic', async () => {
    const user = await createUser();
    const res = await createPost(user.token, { title: 'General chat', body: 'Hi all' });
    expect(res.status).toBe(201);
    expect(res.body.topic).toBeNull();
  });

  it('rejects an unknown topic and invalid input', async () => {
    const user = await createUser();

    const badTopic = await createPost(user.token, { topicId: 'nope', title: 'Title', body: 'x' });
    const invalid = await createPost(user.token, { title: 'a', body: '   ' });

    expect(badTopic.status).toBe(400);
    expect(invalid.status).toBe(400);
    expect(invalid.body.error.details.map((d: { path: string }) => d.path).sort()).toEqual([
      'body',
      'title',
    ]);
  });
});

describe('GET /api/posts', () => {
  it('paginates newest first with comment counts', async () => {
    const user = await createUser();
    await seedPosts(user.id, 15);
    const newest = await prisma.communityPost.findFirstOrThrow({ where: { title: 'Post 15' } });
    await prisma.comment.createMany({
      data: [1, 2].map((n) => ({ postId: newest.id, userId: user.id, body: `c${n}` })),
    });

    const page1 = await request(app).get('/api/posts').query({ limit: 10 }).set(auth(user.token));
    const page2 = await request(app)
      .get('/api/posts')
      .query({ limit: 10, page: 2 })
      .set(auth(user.token));

    expect(page1.body).toMatchObject({ page: 1, limit: 10, total: 15, hasMore: true });
    expect(page1.body.posts).toHaveLength(10);
    expect(page1.body.posts[0]).toMatchObject({ title: 'Post 15', commentCount: 2 });
    expect(page2.body).toMatchObject({ page: 2, hasMore: false });
    expect(page2.body.posts.map((p: { title: string }) => p.title)).toEqual([
      'Post 5',
      'Post 4',
      'Post 3',
      'Post 2',
      'Post 1',
    ]);
  });

  it('filters by topic and by category', async () => {
    const user = await createUser();
    const topicA = await createTopic();
    const topicB = await createTopic();
    await seedPosts(user.id, 2, topicA.id);
    await seedPosts(user.id, 3, topicB.id);
    await seedPosts(user.id, 1, null);

    const byTopic = await request(app)
      .get('/api/posts')
      .query({ topicId: topicA.id })
      .set(auth(user.token));
    const byCategory = await request(app)
      .get('/api/posts')
      .query({ categoryId: topicB.categoryId })
      .set(auth(user.token));
    const all = await request(app).get('/api/posts').set(auth(user.token));

    expect(byTopic.body.total).toBe(2);
    expect(byCategory.body.total).toBe(3);
    expect(all.body.total).toBe(6);
  });

  it('rejects an invalid limit', async () => {
    const user = await createUser();
    const res = await request(app).get('/api/posts').query({ limit: 500 }).set(auth(user.token));
    expect(res.status).toBe(400);
  });
});

describe('GET /api/posts/:id and comments', () => {
  it('returns the full post with comments oldest first', async () => {
    const author = await createUser();
    const commenter = await createUser();
    const { body: post } = await createPost(author.token, {
      title: 'Question',
      body: '# Full body',
    });

    await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .set(auth(commenter.token))
      .send({ body: 'First!' })
      .expect(201);
    await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .set(auth(author.token))
      .send({ body: 'Thanks' })
      .expect(201);

    const res = await request(app).get(`/api/posts/${post.id}`).set(auth(author.token)).expect(200);

    expect(res.body.post).toMatchObject({ body: '# Full body', commentCount: 2 });
    expect(res.body.post.comments.map((c: { body: string }) => c.body)).toEqual([
      'First!',
      'Thanks',
    ]);
    expect(res.body.post.comments[0].author).toEqual({
      id: commenter.id,
      displayName: 'Tester',
      avatarUrl: null,
    });
  });

  it('returns NOT_FOUND for missing posts', async () => {
    const user = await createUser();
    await request(app).get('/api/posts/missing').set(auth(user.token)).expect(404);
    const res = await request(app)
      .post('/api/posts/missing/comments')
      .set(auth(user.token))
      .send({ body: 'hello' });
    expect(res.status).toBe(404);
  });

  it('rejects an empty comment', async () => {
    const user = await createUser();
    const { body: post } = await createPost(user.token, { title: 'Question', body: 'Body' });
    const res = await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .set(auth(user.token))
      .send({ body: '  ' });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('lets the author delete their post (and its comments)', async () => {
    const author = await createUser();
    const { body: post } = await createPost(author.token, { title: 'Mine', body: 'Body' });
    await request(app)
      .post(`/api/posts/${post.id}/comments`)
      .set(auth(author.token))
      .send({ body: 'c' });

    await request(app).delete(`/api/posts/${post.id}`).set(auth(author.token)).expect(204);

    expect(await prisma.communityPost.count()).toBe(0);
    expect(await prisma.comment.count()).toBe(0);
  });

  it('forbids other users but allows admins', async () => {
    const author = await createUser();
    const other = await createUser();
    const admin = await createAdmin();
    const { body: post } = await createPost(author.token, { title: 'Mine', body: 'Body' });

    const forbidden = await request(app).delete(`/api/posts/${post.id}`).set(auth(other.token));
    expect(forbidden.status).toBe(403);
    expect(forbidden.body.error.code).toBe(ERROR_CODES.FORBIDDEN);

    await request(app).delete(`/api/posts/${post.id}`).set(auth(admin.token)).expect(204);
  });

  it('returns NOT_FOUND for a missing post', async () => {
    const user = await createUser();
    await request(app).delete('/api/posts/missing').set(auth(user.token)).expect(404);
  });
});

describe('DELETE /api/comments/:id', () => {
  it('lets the comment author or an admin delete, but not others (even the post author)', async () => {
    const postAuthor = await createUser();
    const commenter = await createUser();
    const admin = await createAdmin();
    const { body: post } = await createPost(postAuthor.token, { title: 'Post', body: 'Body' });
    const addComment = async () =>
      (
        await request(app)
          .post(`/api/posts/${post.id}/comments`)
          .set(auth(commenter.token))
          .send({ body: 'hi' })
      ).body.id as string;

    const first = await addComment();
    await request(app).delete(`/api/comments/${first}`).set(auth(postAuthor.token)).expect(403);
    await request(app).delete(`/api/comments/${first}`).set(auth(commenter.token)).expect(204);

    const second = await addComment();
    await request(app).delete(`/api/comments/${second}`).set(auth(admin.token)).expect(204);

    expect(await prisma.comment.count()).toBe(0);
  });
});
