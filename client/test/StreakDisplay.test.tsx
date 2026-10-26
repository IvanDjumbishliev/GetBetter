import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StreakDisplay } from '../src/features/dashboard/StreakDisplay';

describe('StreakDisplay', () => {
  it('shows the current streak', () => {
    render(<StreakDisplay currentStreak={7} longestStreak={12} />);

    expect(screen.getAllByText('7')).toHaveLength(2);
    expect(screen.getByText('Best streak: 12 days')).toBeInTheDocument();
  });

  it('encourages the user when there is no current streak', () => {
    render(<StreakDisplay currentStreak={0} longestStreak={0} />);

    expect(screen.getByText('Start today!')).toBeInTheDocument();
    expect(screen.getByText('Complete a lesson to light up your streak.')).toBeInTheDocument();
  });
});
