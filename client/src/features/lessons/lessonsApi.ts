import type {
  CompleteLessonResponse,
  DailyLessonResponse,
  EnrollResponse,
  LessonDetail,
  TopicDetail,
  TopicSummary,
} from '@shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { http } from '@/lib/http';
import { getTimeZone } from '@/lib/time-zone';

export const lessonKeys = {
  all: ['learning'] as const,
  topics: () => [...lessonKeys.all, 'topics'] as const,
  topic: (slug: string) => [...lessonKeys.all, 'topic', slug] as const,
  lesson: (id: string) => [...lessonKeys.all, 'lesson', id] as const,
  daily: () => [...lessonKeys.all, 'daily'] as const,
};

export function useTopicsQuery() {
  return useQuery({
    queryKey: lessonKeys.topics(),
    queryFn: () => http.get<{ topics: TopicSummary[] }>('/topics').then((res) => res.data.topics),
  });
}

export function useTopicQuery(slug: string) {
  return useQuery({
    queryKey: lessonKeys.topic(slug),
    queryFn: () =>
      http
        .get<{ topic: TopicDetail }>(`/topics/${encodeURIComponent(slug)}`)
        .then((res) => res.data.topic),
  });
}

export function useLessonQuery(id: string) {
  return useQuery({
    queryKey: lessonKeys.lesson(id),
    queryFn: () =>
      http
        .get<{ lesson: LessonDetail }>(`/lessons/${encodeURIComponent(id)}`)
        .then((res) => res.data.lesson),
  });
}

export function useDailyLessonQuery() {
  return useQuery({
    queryKey: lessonKeys.daily(),
    queryFn: () =>
      http
        .get<DailyLessonResponse>('/lessons/daily', { params: { timeZone: getTimeZone() } })
        .then((res) => res.data.dailyLesson),
  });
}

// Enrolling or completing a lesson changes counts, badges and the daily pick, so refresh it all.
function useInvalidateLearning() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: lessonKeys.all });
}

export function useEnrollMutation(slug: string) {
  const invalidate = useInvalidateLearning();
  return useMutation({
    mutationFn: () =>
      http
        .post<EnrollResponse>(`/topics/${encodeURIComponent(slug)}/enroll`)
        .then((res) => res.data),
    onSuccess: invalidate,
  });
}

export function useCompleteLessonMutation(lessonId: string) {
  const invalidate = useInvalidateLearning();
  return useMutation({
    mutationFn: () =>
      http
        .post<CompleteLessonResponse>(`/lessons/${encodeURIComponent(lessonId)}/complete`, {
          timeZone: getTimeZone(),
        })
        .then((res) => res.data),
    onSuccess: invalidate,
  });
}
