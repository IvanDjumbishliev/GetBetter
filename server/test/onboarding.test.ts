import { ERROR_CODES } from '@shared/constants';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { auth, createTopic, createUser } from './fixtures';

describe('POST /api/me/onboarding', () => {
  it('stores preferences and enrolls the user in one random topic per selected category', async () => {
    const user = await createUser();
    const topic = await createTopic({ lessonCount: 2 });

    const response = await request(app)
      .post('/api/me/onboarding')
      .set(auth(user.token))
      .send({
        selectedCategoryIds: [topic.category.id],
        dailyGoalMinutes: 10,
        reminderTime: '08:30',
        timeZone: 'Europe/Sofia',
      })
      .expect(201);

    expect(response.body.user).toMatchObject({
      onboardingCompletedAt: expect.any(String),
      dailyGoalMinutes: 10,
      reminderTime: '08:30',
      preferredTimeZone: 'Europe/Sofia',
    });
    expect(response.body.enrolledTopicIds).toEqual([topic.id]);
    expect(
      await prisma.enrollment.findUnique({
        where: { userId_topicId: { userId: user.id, topicId: topic.id } },
      }),
    ).not.toBeNull();

    const repeated = await request(app)
      .post('/api/me/onboarding')
      .set(auth(user.token))
      .send({
        selectedCategoryIds: [topic.category.id],
        dailyGoalMinutes: 10,
        reminderTime: '08:30',
      });
    expect(repeated.status).toBe(409);
  });

  it('rejects invalid preferences and categories with field-level validation errors', async () => {
    const user = await createUser();

    const response = await request(app)
      .post('/api/me/onboarding')
      .set(auth(user.token))
      .send({ selectedCategoryIds: [], dailyGoalMinutes: 7, reminderTime: '25:99' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'selectedCategoryIds' }),
        expect.objectContaining({ path: 'dailyGoalMinutes' }),
        expect.objectContaining({ path: 'reminderTime' }),
      ]),
    );
  });

  it('requires authentication', async () => {
    await request(app)
      .post('/api/me/onboarding')
      .send({ selectedCategoryIds: ['category'], dailyGoalMinutes: 5, reminderTime: '09:00' })
      .expect(401);
  });
});
