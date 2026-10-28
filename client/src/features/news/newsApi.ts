import type { NewsArticle } from '@shared/types';
import { useQuery } from '@tanstack/react-query';

import { http } from '@/lib/http';

export const newsKeys = {
  all: ['news'] as const,
  topic: (topic: string) => [...newsKeys.all, topic] as const,
};

export function useNewsQuery(topic: string) {
  return useQuery({
    queryKey: newsKeys.topic(topic),
    queryFn: () =>
      http
        .get<{ news: NewsArticle[] }>('/news', { params: { topic, limit: 6 } })
        .then((res) => res.data.news),
  });
}
