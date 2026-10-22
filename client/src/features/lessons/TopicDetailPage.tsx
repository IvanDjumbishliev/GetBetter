import type { TopicDetail } from '@shared/types';
import { ChevronRight, Circle, CircleCheck, Clock, Layers, Users } from 'lucide-react';
import { Link, useParams } from 'react-router';

import { QueryError } from '@/components/QueryError';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiErrorMessage } from '@/lib/api-error';
import { CategoryIcon } from './CategoryIcon';
import { DifficultyBadge } from './DifficultyBadge';
import { useEnrollMutation, useTopicQuery } from './lessonsApi';

export function TopicDetailPage() {
  const { slug = '' } = useParams();
  const topicQuery = useTopicQuery(slug);

  if (topicQuery.isPending) {
    return (
      <div className="space-y-4" aria-label="Loading topic">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (topicQuery.isError) {
    return <QueryError error={topicQuery.error} onRetry={() => void topicQuery.refetch()} />;
  }
  return <TopicDetailView topic={topicQuery.data} />;
}

function TopicDetailView({ topic }: { topic: TopicDetail }) {
  const enroll = useEnrollMutation(topic.slug);
  const nextLesson = topic.lessons.find((lesson) => !lesson.isCompleted);
  const progress = topic.lessonCount ? (topic.completedLessonCount / topic.lessonCount) * 100 : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link to="/topics" className="hover:text-foreground">
          Topics
        </Link>
        <ChevronRight aria-hidden className="h-4 w-4" />
        <span className="flex items-center gap-1">
          <CategoryIcon category={topic.category} className="h-4 w-4" />
          {topic.category.name}
        </span>
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={topic.difficulty} />
          {topic.completedAt && (
            <Badge>
              <CircleCheck aria-hidden className="h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
        {topic.description && <p className="text-lg text-muted-foreground">{topic.description}</p>}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Layers aria-hidden className="h-4 w-4" />
            {topic.lessonCount} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock aria-hidden className="h-4 w-4" />~{topic.estimatedMinutes} min total
          </span>
          <span className="flex items-center gap-1.5">
            <Users aria-hidden className="h-4 w-4" />
            {topic.enrollmentCount} enrolled
          </span>
        </div>
      </header>

      <section className="space-y-3 rounded-lg border p-4">
        {topic.isEnrolled ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Your progress</span>
              <span className="text-muted-foreground">
                {topic.completedLessonCount} of {topic.lessonCount} lessons
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-label="Topic progress"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
            {nextLesson && (
              <Button asChild>
                <Link to={`/lessons/${nextLesson.id}`}>
                  {topic.completedLessonCount > 0 ? 'Continue' : 'Start'}: Lesson {nextLesson.order}
                </Link>
              </Button>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Enroll to get this topic&apos;s lessons as your daily lesson and track your progress.
            </p>
            <Button onClick={() => enroll.mutate()} disabled={enroll.isPending}>
              {enroll.isPending ? 'Enrolling…' : 'Enroll in this topic'}
            </Button>
            {enroll.isError && (
              <p role="alert" className="text-sm text-destructive">
                {getApiErrorMessage(enroll.error)}
              </p>
            )}
          </>
        )}
      </section>

      <section aria-labelledby="lessons-heading" className="space-y-3">
        <h2 id="lessons-heading" className="text-xl font-semibold">
          Lessons
        </h2>
        <ol className="divide-y rounded-lg border">
          {topic.lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                to={`/lessons/${lesson.id}`}
                className="flex items-start gap-3 p-4 transition-colors hover:bg-accent"
              >
                {lesson.isCompleted ? (
                  <CircleCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                ) : (
                  <Circle aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {lesson.order}. {lesson.title}
                    </span>
                    {lesson.isCompleted && <Badge variant="secondary">Completed</Badge>}
                  </div>
                  {lesson.summary && (
                    <p className="text-sm text-muted-foreground">{lesson.summary}</p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {lesson.readMinutes} min
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
