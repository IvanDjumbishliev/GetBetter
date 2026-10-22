import type { QuizGrade } from '@shared/quiz';
import type { QuizAnswer, QuizAttemptResult, QuizQuestion } from '@shared/types';
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api-error';
import { cn } from '@/lib/utils';
import { getScoreMessage, optionLetter } from './quizText';

interface QuizResultsProps {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  /** Graded locally for instant display; the saved result comes from the server. */
  grade: QuizGrade;
  submission: {
    isPending: boolean;
    isError: boolean;
    isSuccess: boolean;
    error: unknown;
    data?: QuizAttemptResult;
  };
  onRetrySubmit: () => void;
  onRetake: () => void;
  onContinue: () => void;
  continueLabel?: string;
}

export function QuizResults({
  questions,
  answers,
  grade,
  submission,
  onRetrySubmit,
  onRetake,
  onContinue,
  continueLabel = 'Continue',
}: QuizResultsProps) {
  const { correctCount, totalCount, score } = submission.data ?? grade;
  const { title, message } = getScoreMessage(score);
  const selectedById = new Map(answers.map((a) => [a.questionId, a.selectedOptionId]));

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-xl border p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Your score
        </p>
        <p className="text-5xl font-bold tracking-tight">
          {correctCount} / {totalCount}
        </p>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {submission.isPending && 'Saving your attempt…'}
          {submission.isSuccess && 'Attempt saved.'}
        </p>
        {submission.isError && (
          <div role="alert" className="text-sm text-destructive">
            Couldn&apos;t save your attempt: {getApiErrorMessage(submission.error)}{' '}
            <Button variant="link" size="sm" className="h-auto p-0" onClick={onRetrySubmit}>
              Retry
            </Button>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button variant="outline" onClick={onRetake}>
            <RotateCcw aria-hidden />
            Retake quiz
          </Button>
          <Button onClick={onContinue}>
            {continueLabel}
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </section>

      <section aria-labelledby="review-heading" className="space-y-4">
        <h3 id="review-heading" className="text-lg font-semibold">
          Review your answers
        </h3>
        <ol className="space-y-4">
          {questions.map((question, i) => {
            const selectedId = selectedById.get(question.id);
            const isCorrect = selectedId === question.correctOptionId;
            const selectedIndex = question.options.findIndex((o) => o.id === selectedId);
            const correctIndex = question.options.findIndex(
              (o) => o.id === question.correctOptionId,
            );
            return (
              <li key={question.id} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white',
                      isCorrect ? 'bg-emerald-500' : 'bg-red-500',
                    )}
                  >
                    {isCorrect ? (
                      <Check aria-label="Correct" className="h-4 w-4" />
                    ) : (
                      <X aria-label="Incorrect" className="h-4 w-4" />
                    )}
                  </span>
                  <p className="font-medium">
                    {i + 1}. {question.question}
                  </p>
                </div>
                <dl className="space-y-1 pl-9 text-sm">
                  <div className="flex gap-1">
                    <dt className="text-muted-foreground">Your answer:</dt>
                    <dd className={cn(!isCorrect && 'text-red-600 dark:text-red-400')}>
                      {selectedIndex >= 0
                        ? `${optionLetter(selectedIndex)}. ${question.options[selectedIndex]!.text}`
                        : 'Not answered'}
                    </dd>
                  </div>
                  {!isCorrect && correctIndex >= 0 && (
                    <div className="flex gap-1">
                      <dt className="text-muted-foreground">Correct answer:</dt>
                      <dd className="text-emerald-700 dark:text-emerald-400">
                        {optionLetter(correctIndex)}. {question.options[correctIndex]!.text}
                      </dd>
                    </div>
                  )}
                  <p className="pt-1 text-muted-foreground">{question.explanation}</p>
                </dl>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
