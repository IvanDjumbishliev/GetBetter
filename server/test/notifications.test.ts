import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { createDueReminders } from '../src/modules/notifications/notificationScheduler';
import { previousDateKey, toDateKey } from '../src/services/streakService';
import { auth, createTopic, createUser } from './fixtures';

describe('GET /api/notifications and PATCH /api/notifications/read-all', () => {
  it('returns only the current user’s latest 20 notifications and marks only theirs as read', async () => {
    const user = await createUser();
    const other = await createUser();
    await prisma.notification.createMany({
      data: [
        ...Array.from({ length: 22 }, (_, index) => ({
          userId: user.id,
          type: 'MILESTONE' as const,
          message: `Milestone ${index}`,
          createdAt: new Date(Date.UTC(2026, 0, 1, 0, index)),
        })),
        { userId: other.id, type: 'NEW_REPLY', message: 'Private reply' },
      ],
    });

    const response = await request(app).get('/api/notifications').set(auth(user.token)).expect(200);
    expect(response.body.notifications).toHaveLength(20);
    expect(response.body.unreadCount).toBe(22);
    expect(response.body.notifications[0].message).toBe('Milestone 21');

    await request(app)
      .patch('/api/notifications/read-all')
      .set(auth(user.token))
      .send({})
      .expect(204);
    expect(await prisma.notification.count({ where: { userId: user.id, readAt: null } })).toBe(0);
    expect(await prisma.notification.count({ where: { userId: other.id, readAt: null } })).toBe(1);
  });

  it('creates a new-reply notification for the post owner', async () => {
    const owner = await createUser();
    const commenter = await createUser();
    const topic = await createTopic();
    const post = await request(app)
      .post('/api/posts')
      .set(auth(owner.token))
      .send({ title: 'A learning question', body: 'How does this work?', topicId: topic.id })
      .expect(201);

    await request(app)
      .post(`/api/posts/${post.body.id}/comments`)
      .set(auth(commenter.token))
      .send({ body: 'Here is an answer.' })
      .expect(201);

    const response = await request(app)
      .get('/api/notifications')
      .set(auth(owner.token))
      .expect(200);
    expect(response.body.notifications[0]).toMatchObject({
      type: 'NEW_REPLY',
      message: 'Tester replied to your post "A learning question"',
      readAt: null,
    });
  });

  it('creates time-zone aware reminders once per day and streak-broken alerts', async () => {
    const reminderUser = await createUser();
    const streakUser = await createUser();
    const completedTodayUser = await createUser();
    const now = new Date('2026-10-26T09:00:00.000Z');

    await prisma.user.updateMany({
      where: { id: { in: [reminderUser.id, streakUser.id, completedTodayUser.id] } },
      data: { onboardingCompletedAt: now, reminderTime: '09:00', preferredTimeZone: 'UTC' },
    });
    await prisma.user.update({
      where: { id: reminderUser.id },
      data: { lastActivityDate: new Date('2026-10-25T00:00:00.000Z') },
    });
    await prisma.user.update({
      where: { id: streakUser.id },
      data: {
        currentStreak: 4,
        lastActivityDate: new Date('2026-10-23T00:00:00.000Z'),
      },
    });
    await prisma.user.update({
      where: { id: completedTodayUser.id },
      data: { lastActivityDate: new Date('2026-10-26T00:00:00.000Z') },
    });

    await createDueReminders(now);
    await createDueReminders(now);

    expect(await prisma.notification.count({ where: { userId: reminderUser.id } })).toBe(1);
    expect(
      await prisma.notification.findMany({
        where: { userId: streakUser.id },
        select: { type: true },
      }),
    ).toEqual(expect.arrayContaining([{ type: 'STREAK_REMINDER' }, { type: 'STREAK_BROKEN' }]));
    expect(await prisma.notification.count({ where: { userId: completedTodayUser.id } })).toBe(0);
  });

  it('creates lesson and streak milestone notifications on completion', async () => {
    const user = await createUser();
    const topic = await createTopic({ lessonCount: 7 });
    const today = toDateKey(new Date(), 'UTC');
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentStreak: 2,
        lastActivityDate: new Date(`${previousDateKey(today)}T00:00:00.000Z`),
      },
    });

    for (const lesson of topic.lessons) {
      await request(app)
        .post(`/api/lessons/${lesson.id}/complete`)
        .set(auth(user.token))
        .send({ timeZone: 'UTC' })
        .expect(201);
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { type: 'asc' },
    });
    expect(notifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'MILESTONE',
          message: expect.stringContaining('7 lessons'),
        }),
        expect.objectContaining({ type: 'MILESTONE', message: expect.stringContaining('3-day') }),
      ]),
    );
  });
});
