import type { QuizGrade } from '@shared/quiz';
import type { LessonDetail } from '@shared/types';
import { ArrowLeft, ArrowRight, ChevronRight, CircleCheck, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { Link, useParams } from 'react-router';

import { QueryError } from '@/components/QueryError';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FlashcardDeck } from '@/features/flashcards/FlashcardDeck';
import { useQuizAttemptsQuery } from '@/features/quiz/quizApi';
import { QuizPlayer } from '@/features/quiz/QuizPlayer';
import { cn } from '@/lib/utils';
import { LessonCompletionScreen } from './LessonCompletionScreen';
import { useCompleteLessonMutation, useLessonQuery } from './lessonsApi';

type Step = 'read' | 'flashcards' | 'quiz' | 'done';

const STEP_LABELS: Record<Step, string> = {
  read: 'Read',
  flashcards: 'Review',
  quiz: 'Quiz',
  done: 'Done',
};

export function LessonPage() {
  const { id = '' } = useParams();
  // Keyed by id so per-lesson state (current step, mutations) resets on navigation.
  return <LessonLoader key={id} id={id} />;
}

function LessonLoader({ id }: { id: string }) {
  const lessonQuery = useLessonQuery(id);

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
  return <LessonFlow lesson={lessonQuery.data} />;
}

/** Read → flashcards → quiz → completion, skipping steps the lesson has no content for. */
function LessonFlow({ lesson }: { lesson: LessonDetail }) {
  const steps: Step[] = [
    'read',
    ...(lesson.flashcards.length > 0 ? (['flashcards'] as const) : []),
    ...(lesson.quizQuestions.length > 0 ? (['quiz'] as const) : []),
    'done',
  ];
  const [step, setStep] = useState<Step>('read');
  const [quizGrade, setQuizGrade] = useState<QuizGrade | null>(null);
  const complete = useCompleteLessonMutation(lesson.id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  // Only the first completion of this run reports streak changes; retakes mustn't overwrite it.
  const completeOnce = () => {
    if (!complete.isSuccess && !complete.isPending) complete.mutate();
  };

  const nextStepAfter = (current: Step) => steps[steps.indexOf(current) + 1] ?? 'done';
  const advanceFrom = (current: Step) => {
    const next = nextStepAfter(current);
    if (next === 'done') completeOnce();
    setStep(next);
  };
  const continueLabel = (current: Step) =>
    nextStepAfter(current) === 'quiz' ? 'Continue to Quiz' : 'Finish lesson';

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <LessonHeader lesson={lesson} />
      <StepIndicator steps={steps} current={step} />

      {step === 'read' && (
        <ReadStep
          lesson={lesson}
          actionLabel={steps.length > 2 ? "I'm ready to review" : 'Mark as complete'}
          onContinue={() => advanceFrom('read')}
        />
      )}
      {step === 'flashcards' && (
        <FlashcardDeck
          flashcards={lesson.flashcards}
          continueLabel={continueLabel('flashcards')}
          onContinue={() => advanceFrom('flashcards')}
        />
      )}
      {step === 'quiz' && (
        <QuizPlayer
          lessonId={lesson.id}
          questions={lesson.quizQuestions}
          onFinished={(grade) => {
            setQuizGrade(grade);
            // Record completion as soon as the quiz is done, even if the user leaves the results.
            completeOnce();
          }}
          continueLabel="Finish lesson"
          onContinue={() => advanceFrom('quiz')}
        />
      )}
      {step === 'done' && (
        <LessonCompletionScreen
          lesson={lesson}
          completion={complete}
          quizGrade={quizGrade}
          onRetry={() => complete.mutate()}
          onReviewAgain={() => setStep('read')}
        />
      )}
    </article>
  );
}

function LessonHeader({ lesson }: { lesson: LessonDetail }) {
  return (
    <header className="space-y-3">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link to="/explore" className="hover:text-foreground">
          Explore
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
        {lesson.isCompleted && (
          <Badge variant="secondary">
            <CircleCheck aria-hidden className="h-3 w-3" />
            Completed
          </Badge>
        )}
      </div>
    </header>
  );
}

function StepIndicator({ steps, current }: { steps: Step[]; current: Step }) {
  const currentIndex = steps.indexOf(current);
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Lesson progress">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="h-px w-6 bg-border sm:w-10" />}
          <span
            aria-current={i === currentIndex ? 'step' : undefined}
            className={cn(
              'flex items-center gap-1.5',
              i === currentIndex ? 'font-semibold text-foreground' : 'text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border text-xs',
                i < currentIndex && 'border-primary bg-primary text-primary-foreground',
                i === currentIndex && 'border-primary',
              )}
            >
              {i < currentIndex ? <CircleCheck aria-hidden className="h-3.5 w-3.5" /> : i + 1}
            </span>
            {STEP_LABELS[step]}
          </span>
        </li>
      ))}
    </ol>
  );
}

interface ReadStepProps {
  lesson: LessonDetail;
  actionLabel: string;
  onContinue: () => void;
}

function ReadStep({ lesson, actionLabel, onContinue }: ReadStepProps) {
  const attempts = useQuizAttemptsQuery(lesson.id);
  const best = attempts.data?.reduce<(typeof attempts.data)[number] | null>(
    (top, attempt) => (!top || attempt.score > top.score ? attempt : top),
    null,
  );

  return (
    <>
      {lesson.summary && <p className="text-lg text-muted-foreground">{lesson.summary}</p>}

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        {/* The page already has an h1, so demote markdown h1s to keep one per page. */}
        <Markdown components={{ h1: 'h2' }}>{lesson.content}</Markdown>
      </div>

      <footer className="space-y-4 border-t pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" onClick={onContinue}>
            {actionLabel}
            <ArrowRight aria-hidden />
          </Button>
          {best && (
            <span className="text-sm text-muted-foreground">
              Best quiz score: {best.correctCount} / {best.totalCount} ({attempts.data!.length}{' '}
              {attempts.data!.length === 1 ? 'attempt' : 'attempts'})
            </span>
          )}
        </div>

        <div className="flex justify-between gap-4 text-sm">
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
          {lesson.nextLesson && (
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
    </>
  );
}
