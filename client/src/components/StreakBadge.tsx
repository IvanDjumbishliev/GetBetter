import { Flame } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  const isActive = streak > 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold tabular-nums',
        isActive
          ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
          : 'border-border text-muted-foreground',
        className,
      )}
      title={`${streak} day streak`}
    >
      <Flame
        aria-hidden
        className={cn('h-3.5 w-3.5', isActive ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground')}
      />
      <span className="sr-only">Current streak:</span>
      {streak}
    </span>
  );
}
