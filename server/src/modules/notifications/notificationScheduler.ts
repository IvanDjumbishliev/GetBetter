import { previousDateKey, toDateKey } from '../../services/streakService';
import { prisma } from '../../lib/prisma';
import type { Prisma } from '@prisma/client';

function localTime(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const hour = parts.find((part) => part.type === 'hour')?.value;
  const minute = parts.find((part) => part.type === 'minute')?.value;
  if (!hour || !minute) throw new Error(`Could not determine local time in ${timeZone}`);
  return `${hour}:${minute}`;
}

export async function createDueReminders(now = new Date()): Promise<void> {
  const users = await prisma.user.findMany({
    where: { onboardingCompletedAt: { not: null }, reminderTime: { not: null } },
    select: {
      id: true,
      reminderTime: true,
      preferredTimeZone: true,
      lastActivityDate: true,
      currentStreak: true,
    },
  });

  const reminders: Prisma.NotificationCreateManyInput[] = [];
  for (const user of users) {
    const timeZone = user.preferredTimeZone ?? 'UTC';
    const today = toDateKey(now, timeZone);
    if (
      user.reminderTime !== localTime(now, timeZone) ||
      user.lastActivityDate?.toISOString().slice(0, 10) === today
    ) {
      continue;
    }

    reminders.push({
      userId: user.id,
      type: 'STREAK_REMINDER',
      message: 'Your daily lesson is ready. Keep your learning streak going!',
      dedupeKey: `streak-reminder:${user.id}:${today}`,
    });

    const lastActivity = user.lastActivityDate?.toISOString().slice(0, 10);
    if (user.currentStreak > 0 && lastActivity && lastActivity < previousDateKey(today)) {
      reminders.push({
        userId: user.id,
        type: 'STREAK_BROKEN',
        message: `Your ${user.currentStreak}-day streak has ended. Start a new one today!`,
        dedupeKey: `streak-broken:${user.id}:${today}`,
      });
    }
  }

  if (reminders.length > 0) {
    await prisma.notification.createMany({ data: reminders, skipDuplicates: true });
  }
}
