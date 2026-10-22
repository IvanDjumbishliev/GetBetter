import { describe, expect, it } from 'vitest';
import {
  calculateStreak,
  getEffectiveStreak,
  previousDateKey,
  toDateKey,
} from '../src/services/streakService';

const streak = (currentStreak: number, longestStreak: number, lastActivityDate: string | null) => ({
  currentStreak,
  longestStreak,
  lastActivityDate,
});

describe('calculateStreak', () => {
  it('starts a streak at 1 on first activity', () => {
    expect(calculateStreak(streak(0, 0, null), '2026-10-22')).toEqual(streak(1, 1, '2026-10-22'));
  });

  it('increments when the last activity was yesterday', () => {
    expect(calculateStreak(streak(4, 10, '2026-10-21'), '2026-10-22')).toEqual(
      streak(5, 10, '2026-10-22'),
    );
  });

  it('does not change when the last activity was today', () => {
    const before = streak(4, 10, '2026-10-22');
    expect(calculateStreak(before, '2026-10-22')).toBe(before);
  });

  it('resets to 1 when the last activity was before yesterday', () => {
    expect(calculateStreak(streak(7, 7, '2026-10-20'), '2026-10-22')).toEqual(
      streak(1, 7, '2026-10-22'),
    );
  });

  it('raises longestStreak when the current streak passes it', () => {
    expect(calculateStreak(streak(3, 3, '2026-10-21'), '2026-10-22')).toEqual(
      streak(4, 4, '2026-10-22'),
    );
  });

  it('handles month and year boundaries', () => {
    expect(calculateStreak(streak(1, 1, '2026-12-31'), '2027-01-01').currentStreak).toBe(2);
    expect(calculateStreak(streak(1, 1, '2028-02-28'), '2028-02-29').currentStreak).toBe(2);
  });
});

describe('date keys', () => {
  it('uses the given time zone to decide the calendar date', () => {
    const instant = new Date('2026-10-22T23:30:00Z');
    expect(toDateKey(instant, 'UTC')).toBe('2026-10-22');
    expect(toDateKey(instant, 'Europe/Sofia')).toBe('2026-10-23');
    expect(toDateKey(instant, 'America/Los_Angeles')).toBe('2026-10-22');
  });

  it('computes the previous day', () => {
    expect(previousDateKey('2026-03-01')).toBe('2026-02-28');
    expect(previousDateKey('2026-01-01')).toBe('2025-12-31');
  });
});

describe('getEffectiveStreak', () => {
  it('keeps the streak when the last activity was today or yesterday', () => {
    expect(getEffectiveStreak(streak(5, 5, '2026-10-22'), '2026-10-22')).toBe(5);
    expect(getEffectiveStreak(streak(5, 5, '2026-10-21'), '2026-10-22')).toBe(5);
  });

  it('is 0 once a day has been missed or with no activity', () => {
    expect(getEffectiveStreak(streak(5, 5, '2026-10-20'), '2026-10-22')).toBe(0);
    expect(getEffectiveStreak(streak(0, 0, null), '2026-10-22')).toBe(0);
  });
});
