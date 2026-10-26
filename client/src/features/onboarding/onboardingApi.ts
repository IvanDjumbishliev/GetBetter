import type { OnboardingInput } from '@shared/schemas';
import type { AuthUser } from '@shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { http } from '@/lib/http';
import { lessonKeys } from '@/features/lessons/lessonsApi';

interface OnboardingResponse {
  user: AuthUser;
  enrolledTopicIds: string[];
}

export function useCompleteOnboardingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OnboardingInput) =>
      http.post<OnboardingResponse>('/me/onboarding', input).then((response) => response.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: lessonKeys.all }),
  });
}
