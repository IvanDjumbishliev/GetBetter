import type { QuizGrade } from '@shared/quiz';
import type { CompleteLessonResponse, LessonDetail } from '@shared/types';
import { ArrowRight, CircleCheck, Flame, Loader2, RotateCcw, Trophy } from 'lucide-react';
import { Link } from 'react-router';

import { QueryError } from '@/components/QueryError';
import { Button } from '@/components/ui/button';
import { todayKey } from '@/lib/time-zone';

interface LessonCompletionScreenProps {
  lesson: LessonDetail;
  completion: {
    isPending: boolean;
    isError: boolean;
    error: unknown;
    data?: CompleteLessonResponse;
  };
  quizGrade: QuizGrade | null;
  onRetry: () => void;
  onReviewAgain: () => void;
}

export function LessonCompletionScreen({
  lesson,
  completion,
  quizGrade,
  onRetry,
  onReviewAgain,
}: LessonCompletionScreenProps) {
  if (completion.isError) {
    return <QueryError error={completion.error} onRetry={onRetry} />;
  }
  const result = completion.data;
  if (!result) {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 py-16 text-muted-foreground"
      >
        <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
        Saving your progress…
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl border p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <CircleCheck aria-hidden className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">
          {result.alreadyCompleted ? 'Review complete' : 'Lesson complete!'}
        </h2>
        <p className="text-muted-foreground">{lesson.title}</p>
        {quizGrade && (
          <p className="text-sm text-muted-foreground">
            Quiz score: {quizGrade.correctCount} / {quizGrade.totalCount}
          </p>
        )}
      </div>

      <StreakSummary result={result} />

      {result.topicCompleted && !result.alreadyCompleted && (
        <p className="flex items-center justify-center gap-2 font-medium">
          <Trophy aria-hidden className="h-5 w-5 text-amber-500" />
          You finished every lesson in {lesson.topic.title}!
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={onReviewAgain}>
          <RotateCcw aria-hidden />
          Review again
        </Button>
        {lesson.nextLesson ? (
          <Button asChild>
            <Link to={`/lessons/${lesson.nextLesson.id}`}>
              Next: {lesson.nextLesson.title}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to={`/topics/${lesson.topic.slug}`}>Back to {lesson.topic.title}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function StreakSummary({ result }: { result: CompleteLessonResponse }) {
  const { currentStreak, longestStreak, lastActivityDate } = result.streak;
  const days = (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`;

  if (result.streakChanged) {
    return (
      <div className="mx-auto max-w-sm space-y-1 rounded-lg bg-orange-50 p-4 dark:bg-orange-950/40">
        <p className="flex items-center justify-center gap-2 text-xl font-semibold">
          <Flame aria-hidden className="h-6 w-6 text-orange-500" />
          {days(currentStreak)} streak!
        </p>
        <p className="text-sm text-muted-foreground">
          {currentStreak === 1
            ? 'Streak started. Come back tomorrow to keep it going.'
            : `Your streak grew by a day. Longest: ${days(longestStreak)}.`}
        </p>
      </div>
    );
  }

  return (
    <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <Flame aria-hidden className="h-4 w-4 text-orange-500" />
      {lastActivityDate === todayKey()
        ? `${days(currentStreak)} streak. You've already practiced today.`
        : 'Reviewing a completed lesson doesn’t extend your streak. Try a new lesson!'}
    </p>
  );
}
