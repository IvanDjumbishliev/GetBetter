import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NotificationBell } from '../src/features/notifications/NotificationBell';

const { mutate } = vi.hoisted(() => ({ mutate: vi.fn() }));

vi.mock('../src/features/notifications/notificationsApi', () => ({
  useNotificationsQuery: () => ({
    data: {
      unreadCount: 1,
      notifications: [
        {
          id: 'notification-1',
          type: 'STREAK_REMINDER',
          message: 'Your daily lesson is ready.',
          readAt: null,
          createdAt: '2026-10-26T09:00:00.000Z',
        },
      ],
    },
    isPending: false,
    isError: false,
    refetch: vi.fn(),
  }),
  useMarkAllNotificationsReadMutation: () => ({ mutate, isPending: false }),
}));

describe('NotificationBell', () => {
  it('shows the unread count and recent notifications, and marks them all read', async () => {
    const user = userEvent.setup();
    render(<NotificationBell />);

    await user.click(screen.getByRole('button', { name: 'Notifications, 1 unread' }));
    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Your daily lesson is ready.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /mark all read/i }));
    expect(mutate).toHaveBeenCalledOnce();
  });
});
