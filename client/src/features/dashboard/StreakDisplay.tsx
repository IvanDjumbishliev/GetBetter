import { Flame } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

const days = (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`;

export function StreakDisplay({ currentStreak, longestStreak, className }: StreakDisplayProps) {
  const isActive = currentStreak > 0;

  return (
    <Card className={cn('flex', className)}>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
        <Flame
          aria-hidden
          className={cn('h-10 w-10', isActive ? 'text-orange-500' : 'text-muted-foreground/50')}
        />
        <p className="text-6xl font-bold leading-none tracking-tight">{currentStreak}</p>
        <p className="text-sm font-medium text-muted-foreground">day streak</p>
        {isActive ? (
          <p className="text-sm text-muted-foreground">Best streak: {days(longestStreak)}</p>
        ) : (
          <div className="space-y-0.5">
            <p className="font-semibold">Start today!</p>
            <p className="text-sm text-muted-foreground">
              Complete a lesson to light up your streak.
              {longestStreak > 0 && ` Your best is ${days(longestStreak)}.`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
