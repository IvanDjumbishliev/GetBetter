import { CircleCheck, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

import { QueryError } from '@/components/QueryError';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryIcon } from './CategoryIcon';
import { useDailyLessonQuery } from './lessonsApi';

export function DailyLessonCard() {
  const dailyQuery = useDailyLessonQuery();

  if (dailyQuery.isPending) {
    return <Skeleton className="h-52 w-full rounded-xl" aria-label="Loading today's lesson" />;
  }
  if (dailyQuery.isError) {
    return <QueryError error={dailyQuery.error} onRetry={() => void dailyQuery.refetch()} />;
  }

  const daily = dailyQuery.data;
  if (!daily) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>You&apos;re all caught up</CardTitle>
          <CardDescription>
            You&apos;ve completed every lesson available. Nice work!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/explore">Browse topics</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { lesson, topic } = daily;
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {daily.reason === 'continue' ? "Today's lesson" : 'Recommended for you'}
          </span>
          {daily.completedToday && (
            <Badge variant="secondary">
              <CircleCheck aria-hidden className="h-3 w-3" />
              Today&apos;s goal done
            </Badge>
          )}
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <CategoryIcon category={topic.category} className="h-6 w-6" />
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-xl">{lesson.title}</CardTitle>
            <CardDescription>
              {topic.title} · Lesson {lesson.order} of {topic.lessonCount}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lesson.summary && <p className="text-sm text-muted-foreground">{lesson.summary}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock aria-hidden className="h-4 w-4" />
            {lesson.readMinutes} min
          </span>
          <Button asChild>
            <Link to={`/lessons/${lesson.id}`}>
              <Sparkles aria-hidden />
              {daily.completedToday ? 'Keep Learning' : "Start Today's Lesson"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
