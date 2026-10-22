import { ERROR_CODES } from '@shared/constants';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { auth, createTopic, createUser } from './fixtures';

const daysAgo = (n: number) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - n);
  return date;
};

describe('lessons routes', () => {
  it('require authentication', async () => {
    await request(app).get('/api/topics').expect(401);
    await request(app).get('/api/lessons/daily').expect(401);
  });
});

describe('GET /api/topics', () => {
  it('lists topics with category, counts and enrollment state', async () => {
    const user = await createUser();
    const other = await createUser();
    const topic = await createTopic({ lessonCount: 2 });
    await prisma.enrollment.create({ data: { userId: other.id, topicId: topic.id } });

    const res = await request(app).get('/api/topics').set(auth(user.token)).expect(200);

    expect(res.body.topics).toEqual([
      expect.objectContaining({
        slug: topic.slug,
        lessonCount: 2,
        enrollmentCount: 1,
        isEnrolled: false,
        category: expect.objectContaining({ slug: topic.category.slug }),
      }),
    ]);
  });
});

describe('GET /api/topics/:slug', () => {
  it('returns the topic with ordered lessons and completion flags', async () => {
    const user = await createUser();
    const topic = await createTopic({ lessonCount: 3 });
    await prisma.lessonProgress.create({
      data: { userId: user.id, lessonId: topic.lessons[1]!.id },
    });

    const res = await request(app)
      .get(`/api/topics/${topic.slug}`)
      .set(auth(user.token))
      .expect(200);

    expect(res.body.topic.lessons.map((l: { order: number }) => l.order)).toEqual([1, 2, 3]);
    expect(res.body.topic.lessons.map((l: { isCompleted: boolean }) => l.isCompleted)).toEqual([
      false,
      true,
      false,
    ]);
    expect(res.body.topic.completedLessonCount).toBe(1);
  });

  it('returns NOT_FOUND for an unknown slug', async () => {
    const user = await createUser();
    const res = await request(app).get('/api/topics/nope').set(auth(user.token));
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe(ERROR_CODES.NOT_FOUND);
  });
});

describe('POST /api/topics/:slug/enroll', () => {
  it('enrolls once and is idempotent', async () => {
    const user = await createUser();
    const topic = await createTopic();

    const first = await request(app).post(`/api/topics/${topic.slug}/enroll`).set(auth(user.token));
    const second = await request(app)
      .post(`/api/topics/${topic.slug}/enroll`)
      .set(auth(user.token));

    expect(first.status).toBe(201);
    expect(first.body.alreadyEnrolled).toBe(false);
    expect(second.status).toBe(200);
    expect(second.body.alreadyEnrolled).toBe(true);
    expect(await prisma.enrollment.count({ where: { userId: user.id } })).toBe(1);
  });
});

describe('GET /api/lessons/:id', () => {
  it('returns content, flashcards and quiz questions with answers', async () => {
    const user = await createUser();
    const topic = await createTopic({ lessonCount: 3 });
    const lesson = topic.lessons[1]!;

    const res = await request(app)
      .get(`/api/lessons/${lesson.id}`)
      .set(auth(user.token))
      .expect(200);

    expect(res.body.lesson).toMatchObject({
      id: lesson.id,
      content: lesson.content,
      readMinutes: 1,
      isCompleted: false,
      topic: { slug: topic.slug },
      previousLesson: { id: topic.lessons[0]!.id },
      nextLesson: { id: topic.lessons[2]!.id },
    });
    expect(res.body.lesson.flashcards).toHaveLength(1);
    expect(res.body.lesson.quizQuestions[0]).toEqual({
      id: expect.any(String),
      question: 'Q1?',
      options: [
        { id: 'a', text: 'A' },
        { id: 'b', text: 'B' },
        { id: 'c', text: 'C' },
        { id: 'd', text: 'D' },
      ],
      correctOptionId: 'a',
      explanation: 'Because.',
    });
  });
});

describe('POST /api/lessons/:id/complete', () => {
  it('records progress, auto-enrolls and starts a streak', async () => {
    const user = await createUser();
    const topic = await createTopic({ lessonCount: 2 });

    const res = await request(app)
      .post(`/api/lessons/${topic.lessons[0]!.id}/complete`)
      .set(auth(user.token))
      .send({ timeZone: 'UTC' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      alreadyCompleted: false,
      topicCompleted: false,
      streakChanged: true,
      streak: { currentStreak: 1, longestStreak: 1 },
    });
    expect(await prisma.enrollment.count({ where: { userId: user.id } })).toBe(1);
  });

  it('increments the streak when the last activity was yesterday', async () => {
    const user = await createUser();
    const topic = await createTopic();
    await prisma.user.update({
      where: { id: user.id },
      data: { currentStreak: 3, longestStreak: 3, lastActivityDate: daysAgo(1) },
    });

    const res = await request(app)
      .post(`/api/lessons/${topic.lessons[0]!.id}/complete`)
      .set(auth(user.token))
      .send({ timeZone: 'UTC' });

    expect(res.body.streak).toMatchObject({ currentStreak: 4, longestStreak: 4 });
  });

  it('resets the streak after a missed day but keeps longestStreak', async () => {
    const user = await createUser();
    const topic = await createTopic();
    await prisma.user.update({
      where: { id: user.id },
      data: { currentStreak: 5, longestStreak: 9, lastActivityDate: daysAgo(3) },
    });

    const res = await request(app)
      .post(`/api/lessons/${topic.lessons[0]!.id}/complete`)
      .set(auth(user.token))
      .send({ timeZone: 'UTC' });

    expect(res.body.streak).toMatchObject({ currentStreak: 1, longestStreak: 9 });
  });

  it('is idempotent and does not double-count the streak', async () => {
    const user = await createUser();
    const topic = await createTopic();
    const url = `/api/lessons/${topic.lessons[0]!.id}/complete`;

    await request(app).post(url).set(auth(user.token)).send({ timeZone: 'UTC' }).expect(201);
    const again = await request(app).post(url).set(auth(user.token)).send({ timeZone: 'UTC' });

    expect(again.status).toBe(200);
    expect(again.body).toMatchObject({
      alreadyCompleted: true,
      streakChanged: false,
      streak: { currentStreak: 1 },
    });
    expect(await prisma.lessonProgress.count({ where: { userId: user.id } })).toBe(1);
  });

  it('reports no streak change for a second lesson on the same day', async () => {
    const user = await createUser();
    const topic = await createTopic({ lessonCount: 2 });

    await request(app)
      .post(`/api/lessons/${topic.lessons[0]!.id}/complete`)
      .set(auth(user.token))
      .send({ timeZone: 'UTC' })
      .expect(201);
    const second = await request(app)
      .post(`/api/lessons/${topic.lessons[1]!.id}/complete`)
      .set(auth(user.token))
      .send({ timeZone: 'UTC' });

    expect(second.body).toMatchObject({
      alreadyCompleted: false,
      streakChanged: false,
      streak: { currentStreak: 1 },
    });
  });

  it('marks the enrollment complete after the last lesson', async () => {
    const user = await createUser();
    const topic = await createTopic({ lessonCount: 2 });

    for (const lesson of topic.lessons) {
      await request(app)
        .post(`/api/lessons/${lesson.id}/complete`)
        .set(auth(user.token))
        .expect(201);
    }

    const enrollment = await prisma.enrollment.findFirstOrThrow({ where: { userId: user.id } });
    expect(enrollment.completedAt).not.toBeNull();
  });

  it('rejects an invalid time zone', async () => {
    const user = await createUser();
    const topic = await createTopic();

    const res = await request(app)
      .post(`/api/lessons/${topic.lessons[0]!.id}/complete`)
      .set(auth(user.token))
      .send({ timeZone: 'Mars/Olympus_Mons' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });
});

describe('GET /api/lessons/daily', () => {
  it('returns the next incomplete lesson of the earliest enrollment', async () => {
    const user = await createUser();
    const first = await createTopic({ lessonCount: 3 });
    const second = await createTopic({ lessonCount: 3 });
    await prisma.enrollment.create({
      data: { userId: user.id, topicId: second.id, enrolledAt: new Date('2026-01-02') },
    });
    await prisma.enrollment.create({
      data: { userId: user.id, topicId: first.id, enrolledAt: new Date('2026-01-01') },
    });
    await prisma.lessonProgress.create({
      data: { userId: user.id, lessonId: first.lessons[0]!.id },
    });

    const res = await request(app).get('/api/lessons/daily').set(auth(user.token)).expect(200);

    expect(res.body.dailyLesson).toMatchObject({
      reason: 'continue',
      lesson: { id: first.lessons[1]!.id },
      topic: { slug: first.slug },
    });
  });

  it('moves on to the next enrolled topic once one is finished', async () => {
    const user = await createUser();
    const first = await createTopic({ lessonCount: 1 });
    const second = await createTopic({ lessonCount: 2 });
    await prisma.enrollment.createMany({
      data: [
        { userId: user.id, topicId: first.id, enrolledAt: new Date('2026-01-01') },
        { userId: user.id, topicId: second.id, enrolledAt: new Date('2026-01-02') },
      ],
    });
    await prisma.lessonProgress.create({
      data: { userId: user.id, lessonId: first.lessons[0]!.id },
    });

    const res = await request(app).get('/api/lessons/daily').set(auth(user.token)).expect(200);

    expect(res.body.dailyLesson.lesson.id).toBe(second.lessons[0]!.id);
  });

  it('recommends the first lesson of the most popular topic when not enrolled', async () => {
    const user = await createUser();
    const others = await Promise.all([createUser(), createUser()]);
    await createTopic({ title: 'Quiet topic' });
    const popular = await createTopic({ title: 'Popular topic' });
    await prisma.enrollment.createMany({
      data: others.map((other) => ({ userId: other.id, topicId: popular.id })),
    });

    const res = await request(app).get('/api/lessons/daily').set(auth(user.token)).expect(200);

    expect(res.body.dailyLesson).toMatchObject({
      reason: 'recommended',
      completedToday: false,
      lesson: { id: popular.lessons[0]!.id },
    });
  });

  it('returns null when there is nothing left to learn', async () => {
    const user = await createUser();

    const res = await request(app).get('/api/lessons/daily').set(auth(user.token)).expect(200);

    expect(res.body).toEqual({ dailyLesson: null });
  });
});
