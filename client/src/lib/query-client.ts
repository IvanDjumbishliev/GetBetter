import { MutationCache, QueryClient } from '@tanstack/react-query';
import { showErrorToast } from './toast';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: showErrorToast,
  }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});
