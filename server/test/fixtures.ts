import { Difficulty } from '@prisma/client';
import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';

let counter = 0;
const unique = () => `${Date.now().toString(36)}${(counter++).toString(36)}`;

/** Registers a user through the API and returns their id and an access token. */
export async function createUser() {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: `user-${unique()}@example.com`, password: 'password123', displayName: 'Tester' })
    .expect(201);
  return { id: res.body.user.id as string, token: res.body.accessToken as string };
}

/** Creates a category + topic with `lessonCount` lessons (orders 1..n), each with a flashcard and quiz. */
export async function createTopic(
  options: {
    title?: string;
    lessonCount?: number;
    /** Quiz questions per lesson; each has options a–d with "a" correct. */
    questionCount?: number;
    difficulty?: Difficulty;
  } = {},
) {
  const id = unique();
  const title = options.title ?? `Topic ${id}`;
  return prisma.topic.create({
    data: {
      title,
      slug: `topic-${id}`,
      difficulty: options.difficulty ?? Difficulty.BEGINNER,
      estimatedMinutes: 30,
      category: { create: { name: `Category ${id}`, slug: `category-${id}` } },
      lessons: {
        create: Array.from({ length: options.lessonCount ?? 3 }, (_, i) => ({
          order: i + 1,
          title: `${title} lesson ${i + 1}`,
          content: `# Lesson ${i + 1}\n\nSome content.`,
          flashcards: { create: [{ front: 'Front', back: 'Back' }] },
          quizQuestions: {
            create: Array.from({ length: options.questionCount ?? 1 }, (_, q) => ({
              question: `Q${q + 1}?`,
              options: ['a', 'b', 'c', 'd'].map((optionId) => ({
                id: optionId,
                text: optionId.toUpperCase(),
              })),
              correctOptionId: 'a',
              explanation: 'Because.',
            })),
          },
        })),
      },
    },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: { quizQuestions: { orderBy: { id: 'asc' } } },
      },
      category: true,
    },
  });
}

export const auth = (token: string) => ({ Authorization: `Bearer ${token}` });
