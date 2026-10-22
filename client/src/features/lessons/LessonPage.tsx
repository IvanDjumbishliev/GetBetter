import type { LessonDetail } from '@shared/types';
import { ArrowLeft, ArrowRight, ChevronRight, CircleCheck, Clock, Flame } from 'lucide-react';
import { useEffect } from 'react';
import Markdown from 'react-markdown';
import { Link, useParams } from 'react-router';

import { QueryError } from '@/components/QueryError';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getApiErrorMessage } from '@/lib/api-error';
import { useCompleteLessonMutation, useLessonQuery } from './lessonsApi';

export function LessonPage() {
  const { id = '' } = useParams();
  // Keyed by id so per-lesson state (e.g. the completion mutation) resets on navigation.
  return <LessonLoader key={id} id={id} />;
}

function LessonLoader({ id }: { id: string }) {
  const lessonQuery = useLessonQuery(id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (lessonQuery.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-label="Loading lesson">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (lessonQuery.isError) {
    return <QueryError error={lessonQuery.error} onRetry={() => void lessonQuery.refetch()} />;
  }
  return <LessonView lesson={lessonQuery.data} />;
}

function LessonView({ lesson }: { lesson: LessonDetail }) {
  const complete = useCompleteLessonMutation(lesson.id);
  const result = complete.data;
  const isCompleted = lesson.isCompleted || complete.isSuccess;

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
        >
          <Link to="/topics" className="hover:text-foreground">
            Topics
          </Link>
          <ChevronRight aria-hidden className="h-4 w-4" />
          <Link to={`/topics/${lesson.topic.slug}`} className="hover:text-foreground">
            {lesson.topic.title}
          </Link>
          <ChevronRight aria-hidden className="h-4 w-4" />
          <span aria-current="page">Lesson {lesson.order}</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock aria-hidden className="h-4 w-4" />
            {lesson.readMinutes} min read
          </span>
          {isCompleted && (
            <Badge variant="secondary">
              <CircleCheck aria-hidden className="h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>
        {lesson.summary && <p className="text-lg text-muted-foreground">{lesson.summary}</p>}
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        {/* The page already has an h1, so demote markdown h1s to keep one per page. */}
        <Markdown components={{ h1: 'h2' }}>{lesson.content}</Markdown>
      </div>

      <footer className="space-y-4 border-t pt-6">
        {result && !result.alreadyCompleted && (
          <div role="status" className="rounded-lg border bg-secondary/50 p-4 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <Flame aria-hidden className="h-4 w-4 text-orange-500" />
              Lesson complete! You&apos;re on a {result.streak.currentStreak}-day streak.
            </p>
            {result.topicCompleted && (
              <p className="mt-1 text-muted-foreground">
                You finished every lesson in {lesson.topic.title}. 🎉
              </p>
            )}
          </div>
        )}
        {complete.isError && (
          <p role="alert" className="text-sm text-destructive">
            {getApiErrorMessage(complete.error)}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {isCompleted ? (
            <Button variant="secondary" disabled>
              <CircleCheck aria-hidden />
              Completed
            </Button>
          ) : (
            <Button onClick={() => complete.mutate()} disabled={complete.isPending}>
              {complete.isPending ? 'Saving…' : 'Mark as complete'}
            </Button>
          )}
          {isCompleted && lesson.nextLesson && (
            <Button asChild variant={complete.isSuccess ? 'default' : 'outline'}>
              <Link to={`/lessons/${lesson.nextLesson.id}`}>
                Next: {lesson.nextLesson.title}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          )}
        </div>

        <div className="flex justify-between text-sm">
          {lesson.previousLesson ? (
            <Link
              to={`/lessons/${lesson.previousLesson.id}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft aria-hidden className="h-4 w-4" />
              {lesson.previousLesson.title}
            </Link>
          ) : (
            <span />
          )}
          {!isCompleted && lesson.nextLesson && (
            <Link
              to={`/lessons/${lesson.nextLesson.id}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              {lesson.nextLesson.title}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
}
