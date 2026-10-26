import { Bell, CheckCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useMarkAllNotificationsReadMutation, useNotificationsQuery } from './notificationsApi';

const dateTime = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const notifications = useNotificationsQuery();
  const markAllRead = useMarkAllNotificationsReadMutation();
  const unreadCount = notifications.data?.unreadCount ?? 0;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell aria-hidden className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-[60] mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-card shadow-[var(--gb-shadow-overlay)]"
        >
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="font-semibold">Notifications</h2>
            <button
              type="button"
              disabled={unreadCount === 0 || markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck aria-hidden className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </header>

          <div className="max-h-[min(70vh,28rem)] overflow-y-auto">
            {notifications.isPending && (
              <p role="status" className="p-5 text-center text-sm text-muted-foreground">
                Loading notifications…
              </p>
            )}
            {notifications.isError && (
              <div role="alert" className="p-4 text-center text-sm text-muted-foreground">
                Couldn’t load notifications.{' '}
                <button
                  type="button"
                  className="underline"
                  onClick={() => void notifications.refetch()}
                >
                  Try again
                </button>
              </div>
            )}
            {notifications.data?.notifications.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">You’re all caught up.</p>
            )}
            {notifications.data?.notifications.map((notification) => (
              <article
                key={notification.id}
                className={`border-b border-border px-4 py-3 last:border-b-0 ${
                  notification.readAt ? '' : 'bg-primary/[0.04]'
                }`}
              >
                <div className="flex items-start gap-2">
                  {!notification.readAt && (
                    <span
                      aria-label="Unread"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed">{notification.message}</p>
                    <time
                      dateTime={notification.createdAt}
                      className="mt-1 block text-xs text-muted-foreground"
                    >
                      {dateTime.format(new Date(notification.createdAt))}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
