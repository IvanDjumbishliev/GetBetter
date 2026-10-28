import { describe, expect, it } from 'vitest';

import { getDailyFact } from './dailyFact';

describe('getDailyFact', () => {
  it('returns the same fact for the same date and category', () => {
    expect(getDailyFact('2026-10-28', 'Science')).toEqual(getDailyFact('2026-10-28', 'Science'));
  });

  it('rotates the fact daily within every learning category', () => {
    for (const category of ['Science', 'Technology', 'Finance', 'History', 'Design']) {
      expect(getDailyFact('2026-10-28', category)).not.toEqual(
        getDailyFact('2026-10-29', category),
      );
    }
  });

  it('falls back to the full fact list for unknown categories', () => {
    expect(getDailyFact('2026-10-28', 'Unlisted')).toEqual(getDailyFact('2026-10-28'));
  });

  it('rejects invalid dates', () => {
    expect(() => getDailyFact('not-a-date')).toThrow('Invalid daily fact date');
    expect(() => getDailyFact('2026-02-31')).toThrow('Invalid daily fact date');
  });
});
