import { gradeQuiz, type QuizGrade } from '@shared/quiz';
import type { QuizAnswer, QuizQuestion } from '@shared/types';
import { ArrowRight, Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSubmitQuizAttemptMutation } from './quizApi';
import { optionLetter } from './quizText';
import { QuizResults } from './QuizResults';

interface QuizPlayerProps {
  lessonId: string;
  questions: QuizQuestion[];
  /** Fired once all questions are answered (from the click handler, so it runs exactly once per attempt). */
  onFinished?: (grade: QuizGrade) => void;
  /** Called from the results screen's primary button. */
  onContinue: () => void;
  continueLabel?: string;
}

export function QuizPlayer({
  lessonId,
  questions,
  onFinished,
  onContinue,
  continueLabel,
}: QuizPlayerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const submit = useSubmitQuizAttemptMutation(lessonId);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const question = questions[index];
  const selectedOptionId = answers.find((a) => a.questionId === question?.id)?.selectedOptionId;
  const isAnswered = selectedOptionId !== undefined;
  const isLast = index === questions.length - 1;

  // Answer buttons become disabled once answered, so move focus to "Next" for keyboard users.
  useEffect(() => {
    if (isAnswered) nextButtonRef.current?.focus();
  }, [isAnswered]);

  if (showResults || !question) {
    const grade = gradeQuiz(questions, answers);
    return (
      <QuizResults
        questions={questions}
        answers={answers}
        grade={grade}
        submission={submit}
        onRetrySubmit={() => submit.mutate({ answers, grade })}
        onRetake={() => {
          setIndex(0);
          setAnswers([]);
          setShowResults(false);
          submit.reset();
        }}
        onContinue={onContinue}
        continueLabel={continueLabel}
      />
    );
  }

  const select = (optionId: string) => {
    if (isAnswered) return;
    setAnswers((prev) => [...prev, { questionId: question.id, selectedOptionId: optionId }]);
  };

  const next = () => {
    if (!isLast) {
      setIndex(index + 1);
      return;
    }
    const grade = gradeQuiz(questions, answers);
    setShowResults(true);
    submit.mutate({ answers, grade });
    onFinished?.(grade);
  };

  const isCorrect = selectedOptionId === question.correctOptionId;
  const correctIndex = question.options.findIndex((o) => o.id === question.correctOptionId);
  const progress = ((index + (isAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium" aria-live="polite">
          Question {index + 1} of {questions.length}
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Keyed by question so option buttons don't carry colour transitions across questions. */}
      <fieldset key={question.id} className="space-y-3">
        <legend className="mb-4 text-xl font-semibold">{question.question}</legend>
        {question.options.map((option, i) => {
          const isSelected = option.id === selectedOptionId;
          const isCorrectOption = option.id === question.correctOptionId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => select(option.id)}
              disabled={isAnswered}
              aria-pressed={isSelected}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                // Transition only the hover state; answer feedback should appear instantly.
                !isAnswered && 'transition-colors hover:border-primary/50 hover:bg-accent',
                isAnswered &&
                  isCorrectOption &&
                  'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
                isAnswered &&
                  isSelected &&
                  !isCorrectOption &&
                  'border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100',
                isAnswered && !isCorrectOption && !isSelected && 'opacity-60',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-sm font-semibold',
                  isAnswered && isCorrectOption && 'border-emerald-500 bg-emerald-500 text-white',
                  isAnswered &&
                    isSelected &&
                    !isCorrectOption &&
                    'border-red-500 bg-red-500 text-white',
                )}
              >
                {isAnswered && isCorrectOption ? (
                  <Check aria-hidden className="h-4 w-4" />
                ) : isAnswered && isSelected ? (
                  <X aria-hidden className="h-4 w-4" />
                ) : (
                  optionLetter(i)
                )}
              </span>
              <span className="flex-1">{option.text}</span>
            </button>
          );
        })}
      </fieldset>

      {isAnswered && (
        <div role="status" className="space-y-3">
          <div
            className={cn(
              'rounded-lg border p-4 text-sm',
              isCorrect
                ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/40'
                : 'border-red-500/40 bg-red-50/50 dark:bg-red-950/40',
            )}
          >
            <p className="font-semibold">
              {isCorrect ? 'Correct!' : `Not quite. The answer is ${optionLetter(correctIndex)}.`}
            </p>
            <p className="mt-1 text-muted-foreground">{question.explanation}</p>
          </div>
          <div className="flex justify-end">
            <Button ref={nextButtonRef} onClick={next}>
              {isLast ? 'See results' : 'Next question'}
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
