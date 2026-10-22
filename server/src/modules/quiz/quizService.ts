import { ERROR_CODES } from '@shared/constants';
import { gradeQuiz } from '@shared/quiz';
import type { CreateQuizAttemptInput } from '@shared/schemas';
import type { QuizAnswer, QuizAttempt, QuizAttemptResult, QuizOption } from '@shared/types';
import type { Prisma, QuizAttempt as QuizAttemptRow } from '@prisma/client';
import { AppError } from '../../lib/errors';
import { prisma } from '../../lib/prisma';

const invalidAnswers = (message: string) =>
  new AppError(400, ERROR_CODES.VALIDATION_ERROR, message);

const toResult = (attempt: QuizAttemptRow): QuizAttemptResult => ({
  id: attempt.id,
  score: attempt.score,
  correctCount: attempt.correctCount,
  totalCount: attempt.totalCount,
  attemptedAt: attempt.attemptedAt.toISOString(),
});

/** Grades the answers against the stored questions (any client-sent score is ignored) and saves the attempt. */
export async function createAttempt(
  userId: string,
  input: CreateQuizAttemptInput,
): Promise<QuizAttemptResult> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: input.lessonId },
    select: { quizQuestions: { select: { id: true, options: true, correctOptionId: true } } },
  });
  if (!lesson) throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Lesson not found');
  if (lesson.quizQuestions.length === 0) throw invalidAnswers('This lesson has no quiz');

  const questions = new Map(lesson.quizQuestions.map((q) => [q.id, q]));
  const seen = new Set<string>();
  for (const answer of input.answers) {
    const question = questions.get(answer.questionId);
    if (!question) throw invalidAnswers(`Question ${answer.questionId} is not part of this lesson`);
    if (seen.has(answer.questionId)) {
      throw invalidAnswers(`Question ${answer.questionId} was answered more than once`);
    }
    seen.add(answer.questionId);
    const options = question.options as unknown as QuizOption[];
    if (!options.some((option) => option.id === answer.selectedOptionId)) {
      throw invalidAnswers(`Option ${answer.selectedOptionId} is not valid for this question`);
    }
  }

  const answers: QuizAnswer[] = input.answers.map(({ questionId, selectedOptionId }) => ({
    questionId,
    selectedOptionId,
  }));
  const grade = gradeQuiz(lesson.quizQuestions, answers);

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      lessonId: input.lessonId,
      answers: answers as unknown as Prisma.InputJsonArray,
      ...grade,
    },
  });
  return toResult(attempt);
}

/** The user's attempts for a lesson, newest first. */
export async function listAttempts(userId: string, lessonId: string): Promise<QuizAttempt[]> {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, select: { id: true } });
  if (!lesson) throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Lesson not found');

  const attempts = await prisma.quizAttempt.findMany({
    where: { userId, lessonId },
    orderBy: [{ attemptedAt: 'desc' }, { id: 'desc' }],
  });
  return attempts.map((attempt) => ({
    ...toResult(attempt),
    lessonId: attempt.lessonId,
    answers: attempt.answers as unknown as QuizAnswer[],
  }));
}
