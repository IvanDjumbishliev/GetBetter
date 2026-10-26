import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { QuizPlayer } from '../src/features/quiz/QuizPlayer';

const { mutate, reset } = vi.hoisted(() => ({ mutate: vi.fn(), reset: vi.fn() }));

vi.mock('../src/features/quiz/quizApi', () => ({
  useSubmitQuizAttemptMutation: () => ({
    mutate,
    reset,
    isPending: false,
    isError: false,
    isSuccess: true,
    error: null,
  }),
}));

describe('QuizPlayer', () => {
  it('selects an answer, scores it, and displays the results', async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    const onFinished = vi.fn();
    render(
      <QuizPlayer
        lessonId="lesson-1"
        questions={[
          {
            id: 'question-1',
            question: 'Which answer is correct?',
            options: [
              { id: 'a', text: 'Correct choice' },
              { id: 'b', text: 'Wrong choice' },
            ],
            correctOptionId: 'a',
            explanation: 'Choice A is correct.',
          },
        ]}
        onContinue={onContinue}
        onFinished={onFinished}
      />,
    );

    await user.click(screen.getByRole('button', { name: /correct choice/i }));
    expect(screen.getByText('Correct!')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /see results/i }));

    expect(screen.getByText('1 / 1')).toBeInTheDocument();
    expect(screen.getByText('Attempt saved.')).toBeInTheDocument();
    expect(mutate).toHaveBeenCalledOnce();
    expect(onFinished).toHaveBeenCalledWith({ correctCount: 1, totalCount: 1, score: 1 });
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(onContinue).toHaveBeenCalledOnce();
  });
});
