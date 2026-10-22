import type { QuizGrade } from '@shared/quiz';
import type { QuizAnswer, QuizAttemptResult, QuizAttemptsResponse } from '@shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { lessonKeys } from '@/features/lessons/lessonsApi';
import { http } from '@/lib/http';

export const quizKeys = {
  attempts: (lessonId: string) => ['quiz-attempts', lessonId] as const,
};

export function useQuizAttemptsQuery(lessonId: string) {
  return useQuery({
    queryKey: quizKeys.attempts(lessonId),
    queryFn: () =>
      http
        .get<QuizAttemptsResponse>('/quiz-attempts', { params: { lessonId } })
        .then((res) => res.data.attempts),
  });
}

export function useSubmitQuizAttemptMutation(lessonId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    // The server re-grades the answers; the local score is sent for reference only.
    mutationFn: ({ answers, grade }: { answers: QuizAnswer[]; grade: QuizGrade }) =>
      http
        .post<QuizAttemptResult>('/quiz-attempts', { lessonId, answers, score: grade.score })
        .then((res) => res.data),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: quizKeys.attempts(lessonId) }),
        // Quiz totals and averages on the dashboard.
        queryClient.invalidateQueries({ queryKey: [...lessonKeys.all, 'stats'] }),
      ]),
  });
}
