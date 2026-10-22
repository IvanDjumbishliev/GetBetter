import type { CategoryProgress, DailyActivity, UserStats } from '@shared/types';
import { prisma } from '../../lib/prisma';
import {
  getEffectiveStreak,
  previousDateKey,
  toDateKey,
  toStreakInfo,
} from '../../services/streakService';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Date keys from `days - 1` days ago through `today`, oldest first. */
function dateRange(today: string, days: number): string[] {
  const keys = [today];
  while (keys.length < days) keys.unshift(previousDateKey(keys[0]!));
  return keys;
}

async function getDailyActivity(
  userId: string,
  timeZone: string,
  days: number,
  now: Date,
): Promise<DailyActivity[]> {
  const keys = dateRange(toDateKey(now, timeZone), days);
  // One extra day of slack covers time zones ahead of UTC; out-of-range dates are dropped below.
  const since = new Date(now.getTime() - (days + 1) * DAY_MS);

  // completedAt is stored as UTC without a zone, so convert UTC -> user's zone before taking the date.
  const rows = await prisma.$queryRaw<{ date: string; count: number }[]>`
    SELECT to_char(("completedAt" AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone}, 'YYYY-MM-DD') AS date,
           COUNT(*)::int AS count
    FROM "LessonProgress"
    WHERE "userId" = ${userId} AND "completedAt" >= ${since}
    GROUP BY 1
  `;
  const counts = new Map(rows.map((row) => [row.date, row.count]));
  return keys.map((date) => ({ date, lessonsCompleted: counts.get(date) ?? 0 }));
}

async function getCategoryBreakdown(userId: string): Promise<CategoryProgress[]> {
  const [categories, completed] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        topics: { select: { _count: { select: { lessons: true } } } },
      },
    }),
    prisma.$queryRaw<{ categoryId: string; count: number }[]>`
      SELECT t."categoryId", COUNT(*)::int AS count
      FROM "LessonProgress" lp
      JOIN "Lesson" l ON l.id = lp."lessonId"
      JOIN "Topic" t ON t.id = l."topicId"
      WHERE lp."userId" = ${userId}
      GROUP BY t."categoryId"
    `,
  ]);
  const completedByCategory = new Map(completed.map((row) => [row.categoryId, row.count]));

  return categories.map((category) => ({
    categoryName: category.name,
    categorySlug: category.slug,
    lessonsCompleted: completedByCategory.get(category.id) ?? 0,
    totalLessons: category.topics.reduce((sum, topic) => sum + topic._count.lessons, 0),
  }));
}

export async function getUserStats(
  userId: string,
  options: { timeZone?: string; days: number },
  now = new Date(),
): Promise<UserStats> {
  const timeZone = options.timeZone ?? 'UTC';

  const [
    user,
    totalLessonsCompleted,
    totalTopicsEnrolled,
    quizStats,
    weeklyActivity,
    categoryBreakdown,
  ] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { currentStreak: true, longestStreak: true, lastActivityDate: true },
    }),
    prisma.lessonProgress.count({ where: { userId } }),
    prisma.enrollment.count({ where: { userId } }),
    prisma.quizAttempt.aggregate({ where: { userId }, _count: true, _avg: { score: true } }),
    getDailyActivity(userId, timeZone, options.days, now),
    getCategoryBreakdown(userId),
  ]);

  const streak = toStreakInfo(user);
  return {
    currentStreak: getEffectiveStreak(streak, toDateKey(now, timeZone)),
    longestStreak: streak.longestStreak,
    totalLessonsCompleted,
    totalTopicsEnrolled,
    totalQuizzesTaken: quizStats._count,
    averageQuizScore: quizStats._avg.score ?? 0,
    weeklyActivity,
    categoryBreakdown,
  };
}
