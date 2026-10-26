import { schedule, type ScheduledTask } from 'node-cron';
import { createDueReminders } from './notificationScheduler';

export function startNotificationCron(): ScheduledTask {
  return schedule(
    '* * * * *',
    () => {
      void createDueReminders().catch((error: unknown) => {
        console.error('Failed to create scheduled notifications:', error);
      });
    },
    { timezone: 'UTC' },
  );
}
