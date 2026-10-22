import type { StreakInfo } from '@shared/types';
import type { Prisma } from '@prisma/client';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Calendar date ("YYYY-MM-DD") of `date` as seen in `timeZone`. */
export function toDateKey(date: Date, timeZone = 'UTC'): string {
  // en-CA formats dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function previousDateKey(dateKey: string): string {
  return new Date(Date.parse(`${dateKey}T00:00:00Z`) - DAY_MS).toISOString().slice(0, 10);
}

/** Postgres DATE columns come back from Prisma as UTC midnight. */
export const fromDbDate = (date: Date | null) => (date ? date.toISOString().slice(0, 10) : null);
const toDbDate = (dateKey: string) => new Date(`${dateKey}T00:00:00Z`);

/**
 * Applies one day of activity on `today` to a streak:
 * - last activity yesterday -> streak + 1
 * - last activity today     -> unchanged
 * - older (or never)        -> reset to 1
 */
export function calculateStreak(streak: StreakInfo, today: string): StreakInfo {
  const last = streak.lastActivityDate;

  // ">=" also covers a later date than today, e.g. after the user switches to an earlier time zone.
  if (last && last >= today && streak.currentStreak > 0) {
    return streak;
  }

  const currentStreak = last === previousDateKey(today) ? streak.currentStreak + 1 : 1;
  return {
    currentStreak,
    longestStreak: Math.max(streak.longestStreak, currentStreak),
    lastActivityDate: today,
  };
}

export function toStreakInfo(user: {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
}): StreakInfo {
  return {
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    lastActivityDate: fromDbDate(user.lastActivityDate),
  };
}

/** Records activity for the user "today" (in their time zone) and persists the updated streak. */
export async function recordActivity(
  tx: Prisma.TransactionClient,
  userId: string,
  timeZone: string | undefined,
  now = new Date(),
): Promise<StreakInfo> {
  const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
  const before = toStreakInfo(user);
  const after = calculateStreak(before, toDateKey(now, timeZone));

  if (after !== before) {
    await tx.user.update({
      where: { id: userId },
      data: {
        currentStreak: after.currentStreak,
        longestStreak: after.longestStreak,
        lastActivityDate: toDbDate(after.lastActivityDate!),
      },
    });
  }
  return after;
}
