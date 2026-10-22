import { formatDateTime, formatTimeAgo } from '@/lib/time-ago';

export function TimeAgo({ date, className }: { date: string; className?: string }) {
  return (
    <time dateTime={date} title={formatDateTime(date)} className={className}>
      {formatTimeAgo(date)}
    </time>
  );
}
