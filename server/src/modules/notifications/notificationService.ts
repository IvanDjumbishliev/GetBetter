import type { NotificationsResponse } from '@shared/types';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

const LESSON_MILESTONES = [7, 30, 100] as const;
const STREAK_MILESTONES = [3, 7, 30] as const;

const notificationSelect = {
  id: true,
  type: true,
  message: true,
  readAt: true,
  createdAt: true,
} satisfies Prisma.NotificationSelect;

export async function listNotifications(userId: string): Promise<NotificationsResponse> {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      select: notificationSelect,
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.notification.count({ where: { userId, readAt: null } }),
  ]);

  return {
    notifications: notifications.map((notification) => ({
      ...notification,
      readAt: notification.readAt?.toISOString() ?? null,
      createdAt: notification.createdAt.toISOString(),
    })),
    unreadCount,
  };
}

export async function markAllRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}

export async function createMilestoneNotifications(
  tx: Prisma.TransactionClient,
  userId: string,
  completedLessonCount: number,
  currentStreak: number,
): Promise<void> {
  const notifications: Prisma.NotificationCreateManyInput[] = [];
  for (const milestone of LESSON_MILESTONES) {
    if (completedLessonCount >= milestone) {
      notifications.push({
        userId,
        type: 'MILESTONE',
        message: `You’ve completed ${milestone} lessons. Keep up the great work!`,
        dedupeKey: `milestone:lessons:${userId}:${milestone}`,
      });
    }
  }
  for (const milestone of STREAK_MILESTONES) {
    if (currentStreak === milestone) {
      notifications.push({
        userId,
        type: 'MILESTONE',
        message: `You’ve reached a ${milestone}-day learning streak!`,
        dedupeKey: `milestone:streak:${userId}:${milestone}`,
      });
    }
  }

  if (notifications.length > 0) {
    await tx.notification.createMany({ data: notifications, skipDuplicates: true });
  }
}
