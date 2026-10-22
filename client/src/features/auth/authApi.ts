import type { LoginInput } from '@shared/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authClient } from './authClient';
import { useAuth } from './useAuth';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (input: LoginInput) => useAuth.getState().login(input),
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authClient.register,
    onSuccess: (session) => useAuth.getState().setSession(session),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => useAuth.getState().logout(),
    // Drop cached data that belonged to the previous user.
    onSettled: () => queryClient.removeQueries(),
  });
}
