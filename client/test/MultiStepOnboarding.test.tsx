import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router';

import { MultiStepOnboarding } from '../src/features/onboarding/MultiStepOnboarding';
import { useToastStore } from '../src/stores/toast';

const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));

vi.mock('@/features/lessons/lessonsApi', () => ({
  useTopicsQuery: () => ({
    data: [
      {
        category: { id: 'science', name: 'Science', slug: 'science', iconUrl: null },
      },
      {
        category: { id: 'history', name: 'History', slug: 'history', iconUrl: null },
      },
      {
        category: { id: 'design', name: 'Design', slug: 'design', iconUrl: null },
      },
      {
        category: { id: 'finance', name: 'Finance', slug: 'finance', iconUrl: null },
      },
    ],
    isPending: false,
    isError: false,
    isSuccess: true,
    refetch: vi.fn(),
  }),
}));

vi.mock('../src/features/onboarding/onboardingApi', () => ({
  useCompleteOnboardingMutation: () => ({
    mutate,
    isPending: false,
    isError: false,
  }),
}));

describe('MultiStepOnboarding', () => {
  it('limits category selection to three and moves through daily goal and reminder steps', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MultiStepOnboarding />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Science' }));
    await user.click(screen.getByRole('button', { name: 'History' }));
    await user.click(screen.getByRole('button', { name: 'Design' }));
    await user.click(screen.getByRole('button', { name: 'Finance' }));
    expect(screen.getByText('3 of 3 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(
      screen.getByRole('dialog', { name: 'How much time can you spare daily?' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /15.*minutes a day/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByRole('dialog', { name: 'Set your daily reminder' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Reminder time'), { target: { value: '07:45' } });
    expect(screen.getByLabelText('Reminder time')).toHaveValue('07:45');
  });

  it('completes onboarding, redirects to the dashboard, and shows a welcome toast', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/topics']}>
        <MultiStepOnboarding />
        <CurrentPath />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Science' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Start learning' }));

    const [, options] = mutate.mock.calls.at(-1)!;
    await act(async () => {
      options.onSuccess({
        user: {
          id: 'user-1',
          email: 'user@example.com',
          displayName: 'Learner',
          avatarUrl: null,
          role: 'USER',
          onboardingCompletedAt: '2026-10-26T09:00:00.000Z',
          dailyGoalMinutes: 10,
          reminderTime: '09:00',
          preferredTimeZone: 'UTC',
        },
      });
    });

    expect(await screen.findByText('/dashboard')).toBeInTheDocument();
    expect(useToastStore.getState().toasts.at(-1)?.message).toContain('Welcome to GetBetter');
  });
});

function CurrentPath() {
  const location = useLocation();
  return <span>{location.pathname}</span>;
}
