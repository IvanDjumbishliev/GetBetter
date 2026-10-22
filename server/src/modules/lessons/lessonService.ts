import { ERROR_CODES } from '@shared/constants';
import type {
  CategorySummary,
  CompleteLessonResponse,
  DailyLesson,
  EnrollResponse,
  LessonDetail,
  QuizOption,
  TopicDetail,
  TopicSummary,
} from '@shared/types';
import type { Category, Topic } from '@prisma/client';
import { AppError } from '../../lib/errors';
import { prisma } from '../../lib/prisma';
import { fromDbDate, recordActivity, toDateKey, toStreakInfo } from '../../services/streakService';

const WORDS_PER_MINUTE = 200;

export function readMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

const toCategorySummary = (category: Category): CategorySummary => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  iconUrl: category.iconUrl,
});

type TopicWithSummaryData = Topic & {
  category: Category;
  _count: { lessons: number; enrollments: number };
  enrollments: unknown[];
};

const topicSummaryInclude = (userId: string) => ({
  category: true,
  _count: { select: { lessons: true, enrollments: true } },
  enrollments: { where: { userId }, select: { enrolledAt: true, completedAt: true } },
});

function toTopicSummary(topic: TopicWithSummaryData): TopicSummary {
  return {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    description: topic.description,
    difficulty: topic.difficulty,
    estimatedMinutes: topic.estimatedMinutes,
    lessonCount: topic._count.lessons,
    enrollmentCount: topic._count.enrollments,
    isEnrolled: topic.enrollments.length > 0,
    category: toCategorySummary(topic.category),
  };
}

const notFound = (what: string) => new AppError(404, ERROR_CODES.NOT_FOUND, `${what} not found`);

export async function listTopics(userId: string): Promise<TopicSummary[]> {
  const topics = await prisma.topic.findMany({
    include: topicSummaryInclude(userId),
    orderBy: [{ category: { name: 'asc' } }, { difficulty: 'asc' }, { title: 'asc' }],
  });
  return topics.map(toTopicSummary);
}

export async function getTopicBySlug(slug: string, userId: string): Promise<TopicDetail> {
  const topic = await prisma.topic.findUnique({
    where: { slug },
    include: {
      ...topicSummaryInclude(userId),
      lessons: {
        orderBy: { order: 'asc' },
        include: { progresses: { where: { userId }, select: { id: true } } },
      },
    },
  });
  if (!topic) throw notFound('Topic');

  const enrollment = topic.enrollments[0];
  const lessons = topic.lessons.map((lesson) => ({
    id: lesson.id,
    order: lesson.order,
    title: lesson.title,
    summary: lesson.summary,
    readMinutes: readMinutes(lesson.content),
    isCompleted: lesson.progresses.length > 0,
  }));

  return {
    ...toTopicSummary(topic),
    enrolledAt: enrollment?.enrolledAt.toISOString() ?? null,
    completedAt: enrollment?.completedAt?.toISOString() ?? null,
    completedLessonCount: lessons.filter((lesson) => lesson.isCompleted).length,
    lessons,
  };
}

export async function enroll(slug: string, userId: string): Promise<EnrollResponse> {
  const topic = await prisma.topic.findUnique({ where: { slug }, select: { id: true } });
  if (!topic) throw notFound('Topic');

  // skipDuplicates makes double-clicks and concurrent requests safe.
  const [created] = await prisma.enrollment.createManyAndReturn({
    data: [{ userId, topicId: topic.id }],
    skipDuplicates: true,
  });
  const enrollment =
    created ??
    (await prisma.enrollment.findUniqueOrThrow({
      where: { userId_topicId: { userId, topicId: topic.id } },
    }));

  return {
    enrolledAt: enrollment.enrolledAt.toISOString(),
    completedAt: enrollment.completedAt?.toISOString() ?? null,
    alreadyEnrolled: !created,
  };
}

export async function getLesson(id: string, userId: string): Promise<LessonDetail> {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      topic: { include: { category: true } },
      flashcards: { orderBy: { id: 'asc' } },
      quizQuestions: { orderBy: { id: 'asc' } },
      progresses: { where: { userId }, select: { id: true } },
    },
  });
  if (!lesson) throw notFound('Lesson');

  const navSelect = { id: true, order: true, title: true } as const;
  const [previousLesson, nextLesson] = await Promise.all([
    prisma.lesson.findFirst({
      where: { topicId: lesson.topicId, order: { lt: lesson.order } },
      orderBy: { order: 'desc' },
      select: navSelect,
    }),
    prisma.lesson.findFirst({
      where: { topicId: lesson.topicId, order: { gt: lesson.order } },
      orderBy: { order: 'asc' },
      select: navSelect,
    }),
  ]);

  return {
    id: lesson.id,
    order: lesson.order,
    title: lesson.title,
    summary: lesson.summary,
    content: lesson.content,
    readMinutes: readMinutes(lesson.content),
    isCompleted: lesson.progresses.length > 0,
    topic: {
      id: lesson.topic.id,
      slug: lesson.topic.slug,
      title: lesson.topic.title,
      category: toCategorySummary(lesson.topic.category),
    },
    flashcards: lesson.flashcards.map(({ id, front, back }) => ({ id, front, back })),
    quizQuestions: lesson.quizQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options as unknown as QuizOption[],
      correctOptionId: q.correctOptionId,
      explanation: q.explanation,
    })),
    previousLesson,
    nextLesson,
  };
}

export async function completeLesson(
  lessonId: string,
  userId: string,
  timeZone: string | undefined,
): Promise<CompleteLessonResponse> {
  return prisma.$transaction(async (tx) => {
    const lesson = await tx.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, topicId: true },
    });
    if (!lesson) throw notFound('Lesson');

    const [created] = await tx.lessonProgress.createManyAndReturn({
      data: [{ userId, lessonId }],
      skipDuplicates: true,
    });

    if (!created) {
      // Re-completing a lesson doesn't count as new activity for the streak.
      const [progress, user, enrollment] = await Promise.all([
        tx.lessonProgress.findUniqueOrThrow({ where: { userId_lessonId: { userId, lessonId } } }),
        tx.user.findUniqueOrThrow({ where: { id: userId } }),
        tx.enrollment.findUnique({
          where: { userId_topicId: { userId, topicId: lesson.topicId } },
        }),
      ]);
      return {
        lessonId,
        completedAt: progress.completedAt.toISOString(),
        alreadyCompleted: true,
        topicCompleted: Boolean(enrollment?.completedAt),
        streakChanged: false,
        streak: toStreakInfo(user),
      };
    }

    // Completing a lesson implies enrollment in its topic.
    await tx.enrollment.upsert({
      where: { userId_topicId: { userId, topicId: lesson.topicId } },
      create: { userId, topicId: lesson.topicId },
      update: {},
    });

    const [totalLessons, completedLessons] = await Promise.all([
      tx.lesson.count({ where: { topicId: lesson.topicId } }),
      tx.lessonProgress.count({ where: { userId, lesson: { topicId: lesson.topicId } } }),
    ]);
    const topicCompleted = completedLessons >= totalLessons;
    if (topicCompleted) {
      await tx.enrollment.updateMany({
        where: { userId, topicId: lesson.topicId, completedAt: null },
        data: { completedAt: created.completedAt },
      });
    }

    const { streak, changed } = await recordActivity(tx, userId, timeZone, created.completedAt);

    return {
      lessonId,
      completedAt: created.completedAt.toISOString(),
      alreadyCompleted: false,
      topicCompleted,
      streakChanged: changed,
      streak,
    };
  });
}

/**
 * Picks the lesson to show as "today's lesson":
 * 1. The next incomplete lesson across enrolled topics (oldest enrollment first, then lesson order).
 * 2. Otherwise the first incomplete lesson of the most popular topic the user isn't enrolled in.
 */
export async function getDailyLesson(
  userId: string,
  timeZone?: string,
): Promise<DailyLesson | null> {
  const incompleteLessons = {
    where: { progresses: { none: { userId } } },
    orderBy: { order: 'asc' as const },
    take: 1,
  };
  const topicInclude = {
    category: true,
    _count: { select: { lessons: true } },
    lessons: incompleteLessons,
  };

  const [user, enrollments] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { lastActivityDate: true } }),
    prisma.enrollment.findMany({
      where: { userId },
      orderBy: [{ enrolledAt: 'asc' }, { id: 'asc' }],
      include: { topic: { include: topicInclude } },
    }),
  ]);

  let reason: DailyLesson['reason'] = 'continue';
  let topic = enrollments.find((enrollment) => enrollment.topic.lessons.length > 0)?.topic;

  if (!topic) {
    reason = 'recommended';
    topic =
      (await prisma.topic.findFirst({
        where: {
          enrollments: { none: { userId } },
          lessons: { some: { progresses: { none: { userId } } } },
        },
        orderBy: [{ enrollments: { _count: 'desc' } }, { difficulty: 'asc' }, { title: 'asc' }],
        include: topicInclude,
      })) ?? undefined;
  }

  const lesson = topic?.lessons[0];
  if (!topic || !lesson) return null;

  return {
    reason,
    completedToday: fromDbDate(user.lastActivityDate) === toDateKey(new Date(), timeZone),
    lesson: {
      id: lesson.id,
      order: lesson.order,
      title: lesson.title,
      summary: lesson.summary,
      readMinutes: readMinutes(lesson.content),
    },
    topic: {
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      lessonCount: topic._count.lessons,
      category: toCategorySummary(topic.category),
    },
  };
}
