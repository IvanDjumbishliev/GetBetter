/** Helpers for "YYYY-MM-DD" date keys, treated as plain calendar dates (UTC midnight). */

export const parseDateKey = (key: string) => new Date(`${key}T00:00:00Z`);

/** 0 = Sunday ... 6 = Saturday. */
export const dayOfWeek = (key: string) => parseDateKey(key).getUTCDay();

/**
 * Days of activity needed for a Sunday-first grid of `weeks` columns ending today:
 * the full previous weeks plus the current week so far.
 */
export const heatmapDays = (weeks: number, todayKey: string) =>
  (weeks - 1) * 7 + dayOfWeek(todayKey) + 1;

const longDate = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const shortMonth = new Intl.DateTimeFormat(undefined, { month: 'short', timeZone: 'UTC' });

export const formatLongDate = (key: string) => longDate.format(parseDateKey(key));
export const formatMonth = (key: string) => shortMonth.format(parseDateKey(key));
