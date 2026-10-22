import type { UserStats } from '@shared/types';
import { BookCheck, FolderOpen, ListChecks, Target, type LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface StatTileProps {
  label: string;
  value: string;
  caption?: string;
  icon: LucideIcon;
}

function StatTile({ label, value, caption, icon: Icon }: StatTileProps) {
  return (
    <Card>
      <CardContent className="space-y-1 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <Icon aria-hidden className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
      </CardContent>
    </Card>
  );
}

const compact = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });
const percent = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 0 });

type StatsGridProps = Pick<
  UserStats,
  'totalLessonsCompleted' | 'totalTopicsEnrolled' | 'totalQuizzesTaken' | 'averageQuizScore'
>;

export function StatsGrid(stats: StatsGridProps) {
  const hasQuizzes = stats.totalQuizzesTaken > 0;
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile
        label="Lessons completed"
        value={compact.format(stats.totalLessonsCompleted)}
        icon={BookCheck}
      />
      <StatTile
        label="Topics enrolled"
        value={compact.format(stats.totalTopicsEnrolled)}
        icon={FolderOpen}
      />
      <StatTile
        label="Quizzes taken"
        value={compact.format(stats.totalQuizzesTaken)}
        icon={ListChecks}
      />
      <StatTile
        label="Avg. quiz score"
        value={hasQuizzes ? percent.format(stats.averageQuizScore) : '—'}
        caption={hasQuizzes ? undefined : 'No quizzes yet'}
        icon={Target}
      />
    </div>
  );
}
