import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';

import { QueryError } from '@/components/QueryError';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/features/auth/useAuth';
import { DailyLessonCard } from '@/features/lessons/DailyLessonCard';
import { todayKey } from '@/lib/time-zone';
import { ActivityHeatmap } from './ActivityHeatmap';
import { CategoryProgress } from './CategoryProgress';
import { FunFactCard } from './FunFactCard';
import { useStatsQuery } from './dashboardApi';
import { heatmapDays } from './dates';
import { StatsGrid } from './StatsGrid';
import { StreakDisplay } from './StreakDisplay';

const HEATMAP_WEEKS = 12;

export function DashboardPage() {
  const user = useAuth((s) => s.user);
  const statsQuery = useStatsQuery(heatmapDays(HEATMAP_WEEKS, todayKey()));
  const stats = statsQuery.data;
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('view') !== 'progress') return;
    document.getElementById('progress')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [searchParams]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-display text-3xl tracking-tight">
          Hello, {user?.displayName ?? 'learner'}!
        </h1>
        <p className="text-muted-foreground">Ready to get a little better today?</p>
      </div>

      {statsQuery.isError && (
        <QueryError error={statsQuery.error} onRetry={() => void statsQuery.refetch()} />
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {stats ? (
          <StreakDisplay currentStreak={stats.currentStreak} longestStreak={stats.longestStreak} />
        ) : (
          !statsQuery.isError && <Skeleton className="h-52 rounded-xl" />
        )}
        <div className="md:col-span-2">
          <DailyLessonCard />
        </div>
      </div>

      <FunFactCard />

      <div id="progress">
        {stats ? (
          <StatsGrid {...stats} />
        ) : (
          !statsQuery.isError && (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>
          )
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Lessons completed per day</CardDescription>
          </CardHeader>
          <CardContent>
            {stats ? (
              <ActivityHeatmap activity={stats.weeklyActivity} />
            ) : (
              <Skeleton className="h-40" />
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Progress by category</CardTitle>
            <CardDescription>Lessons completed out of all available</CardDescription>
          </CardHeader>
          <CardContent>
            {stats ? (
              <CategoryProgress categories={stats.categoryBreakdown} />
            ) : (
              <Skeleton className="h-40" />
            )}
          </CardContent>
        </Card>
      </div>

      <Button asChild variant="link" className="px-0">
        <Link to="/explore">Browse all topics →</Link>
      </Button>
    </div>
  );
}
