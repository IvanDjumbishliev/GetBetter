import { ERROR_CODES } from '@shared/constants';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { previousDateKey, toDateKey } from '../src/services/streakService';
import { auth, createTopic, createUser } from './fixtures';

const DAY_MS = 24 * 60 * 60 * 1000;

const getStats = (token: string, query: Record<string, string | number> = {}) =>
  request(app).get('/api/me/stats').query(query).set(auth(token));

describe('GET /api/me/stats', () => {
  it('requires authentication', async () => {
    await request(app).get('/api/me/stats').expect(401);
  });

  it('returns zeros and 30 empty days for a new user', async () => {
    const user = await createUser();
    await createTopic({ lessonCount: 2 });

    const res = await getStats(user.token, { timeZone: 'UTC' }).expect(200);

    expect(res.body).toMatchObject({
      currentStreak: 0,
      longestStreak: 0,
      totalLessonsCompleted: 0,
      totalTopicsEnrolled: 0,
      totalQuizzesTaken: 0,
      averageQuizScore: 0,
    });
    expect(res.body.weeklyActivity).toHaveLength(30);
    expect(res.body.weeklyActivity.at(-1)).toEqual({
      date: toDateKey(new Date(), 'UTC'),
      lessonsCompleted: 0,
    });
    expect(res.body.categoryBreakdown).toEqual([
      expect.objectContaining({ lessonsCompleted: 0, totalLessons: 2 }),
    ]);
  });

  it('aggregates lessons, enrollments, quizzes and per-category progress', async () => {
    const user = await createUser();
    const topic = await createTopic({ lessonCount: 3 });
    await createTopic({ lessonCount: 2 });
    await prisma.enrollment.create({ data: { userId: user.id, topicId: topic.id } });
    await prisma.lessonProgress.createMany({
      data: topic.lessons.slice(0, 2).map((lesson) => ({ userId: user.id, lessonId: lesson.id })),
    });
    await prisma.quizAttempt.createMany({
      data: [0.5, 1].map((score) => ({
        userId: user.id,
        lessonId: topic.lessons[0]!.id,
        score,
        correctCount: score * 2,
        totalCount: 2,
        answers: [],
      })),
    });

    const res = await getStats(user.token, { timeZone: 'UTC' }).expect(200);

    expect(res.body).toMatchObject({
      totalLessonsCompleted: 2,
      totalTopicsEnrolled: 1,
      totalQuizzesTaken: 2,
      averageQuizScore: 0.75,
    });
    expect(res.body.weeklyActivity.at(-1).lessonsCompleted).toBe(2);
    expect(res.body.categoryBreakdown).toContainEqual({
      categoryName: topic.category.name,
      categorySlug: topic.category.slug,
      lessonsCompleted: 2,
      totalLessons: 3,
    });
  });

  it("groups activity by day in the user's time zone", async () => {
    const user = await createUser();
    const topic = await createTopic({ lessonCount: 1 });
    // 20:00 UTC two days ago is already the next calendar day in Tokyo (UTC+9).
    const instant = new Date(Date.now() - 2 * DAY_MS);
    instant.setUTCHours(20, 0, 0, 0);
    await prisma.lessonProgress.create({
      data: { userId: user.id, lessonId: topic.lessons[0]!.id, completedAt: instant },
    });

    const dayWithActivity = async (timeZone: string) => {
      const res = await getStats(user.token, { timeZone }).expect(200);
      return res.body.weeklyActivity.find(
        (day: { lessonsCompleted: number }) => day.lessonsCompleted > 0,
      )?.date;
    };

    expect(await dayWithActivity('UTC')).toBe(toDateKey(instant, 'UTC'));
    expect(await dayWithActivity('Asia/Tokyo')).toBe(toDateKey(instant, 'Asia/Tokyo'));
    expect(toDateKey(instant, 'Asia/Tokyo')).not.toBe(toDateKey(instant, 'UTC'));
  });

  it('returns the requested number of consecutive days', async () => {
    const user = await createUser();

    const res = await getStats(user.token, { timeZone: 'UTC', days: 84 }).expect(200);

    const dates: string[] = res.body.weeklyActivity.map((d: { date: string }) => d.date);
    expect(dates).toHaveLength(84);
    for (let i = 1; i < dates.length; i++) {
      expect(previousDateKey(dates[i]!)).toBe(dates[i - 1]);
    }
  });

  it('reports a lapsed streak as 0 but keeps the longest streak', async () => {
    const user = await createUser();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentStreak: 6,
        longestStreak: 6,
        lastActivityDate: new Date(Date.now() - 3 * DAY_MS),
      },
    });

    const res = await getStats(user.token, { timeZone: 'UTC' }).expect(200);

    expect(res.body).toMatchObject({ currentStreak: 0, longestStreak: 6 });
  });

  it('rejects out-of-range days', async () => {
    const user = await createUser();

    const res = await getStats(user.token, { days: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });
});
