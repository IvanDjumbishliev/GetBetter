import { ERROR_CODES } from '@shared/constants';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { auth, createTopic, createUser } from './fixtures';

/** A lesson with 4 questions whose correct option is always "a". */
async function setup() {
  const user = await createUser();
  const topic = await createTopic({ lessonCount: 1, questionCount: 4 });
  const lesson = topic.lessons[0]!;
  return { user, lesson, questionIds: lesson.quizQuestions.map((q) => q.id) };
}

const submit = (token: string, body: object) =>
  request(app).post('/api/quiz-attempts').set(auth(token)).send(body);

describe('POST /api/quiz-attempts', () => {
  it('grades the answers server-side and saves the attempt', async () => {
    const { user, lesson, questionIds } = await setup();
    const answers = questionIds.map((questionId, i) => ({
      questionId,
      selectedOptionId: i < 3 ? 'a' : 'b',
    }));

    // The client-sent score is ignored.
    const res = await submit(user.token, { lessonId: lesson.id, answers, score: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(String),
      score: 0.75,
      correctCount: 3,
      totalCount: 4,
      attemptedAt: expect.any(String),
    });
    const stored = await prisma.quizAttempt.findUniqueOrThrow({ where: { id: res.body.id } });
    expect(stored).toMatchObject({ userId: user.id, score: 0.75, answers });
  });

  it('counts unanswered questions as wrong', async () => {
    const { user, lesson, questionIds } = await setup();

    const res = await submit(user.token, {
      lessonId: lesson.id,
      answers: [{ questionId: questionIds[0], selectedOptionId: 'a' }],
    });

    expect(res.body).toMatchObject({ correctCount: 1, totalCount: 4, score: 0.25 });
  });

  it.each([
    [
      'a question from another lesson',
      (ids: string[]) => [
        { questionId: 'other', selectedOptionId: 'a' },
        ...ids.slice(1).map((questionId) => ({ questionId, selectedOptionId: 'a' })),
      ],
    ],
    [
      'an option that does not exist',
      (ids: string[]) => [{ questionId: ids[0], selectedOptionId: 'z' }],
    ],
    [
      'the same question twice',
      (ids: string[]) => [
        { questionId: ids[0], selectedOptionId: 'a' },
        { questionId: ids[0], selectedOptionId: 'b' },
      ],
    ],
  ])('rejects %s', async (_label, buildAnswers) => {
    const { user, lesson, questionIds } = await setup();

    const res = await submit(user.token, {
      lessonId: lesson.id,
      answers: buildAnswers(questionIds),
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(await prisma.quizAttempt.count()).toBe(0);
  });

  it('returns NOT_FOUND for an unknown lesson', async () => {
    const user = await createUser();

    const res = await submit(user.token, {
      lessonId: 'missing',
      answers: [{ questionId: 'q', selectedOptionId: 'a' }],
    });

    expect(res.status).toBe(404);
  });

  it('requires authentication', async () => {
    await request(app).post('/api/quiz-attempts').send({}).expect(401);
  });
});

describe('GET /api/quiz-attempts', () => {
  it("returns only the current user's attempts for the lesson, newest first", async () => {
    const { user, lesson, questionIds } = await setup();
    const other = await createUser();
    const allCorrect = questionIds.map((questionId) => ({ questionId, selectedOptionId: 'a' }));
    const allWrong = questionIds.map((questionId) => ({ questionId, selectedOptionId: 'b' }));

    await submit(user.token, { lessonId: lesson.id, answers: allWrong }).expect(201);
    await submit(user.token, { lessonId: lesson.id, answers: allCorrect }).expect(201);
    await submit(other.token, { lessonId: lesson.id, answers: allCorrect }).expect(201);

    const res = await request(app)
      .get('/api/quiz-attempts')
      .query({ lessonId: lesson.id })
      .set(auth(user.token))
      .expect(200);

    expect(res.body.attempts).toHaveLength(2);
    expect(res.body.attempts.map((a: { correctCount: number }) => a.correctCount)).toEqual([4, 0]);
    expect(res.body.attempts[0]).toMatchObject({
      lessonId: lesson.id,
      totalCount: 4,
      answers: allCorrect,
    });
  });

  it('requires a lessonId', async () => {
    const user = await createUser();

    const res = await request(app).get('/api/quiz-attempts').set(auth(user.token));

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });
});
