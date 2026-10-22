import type { UserStats } from '@shared/types';
import { useQuery } from '@tanstack/react-query';

import { lessonKeys } from '@/features/lessons/lessonsApi';
import { http } from '@/lib/http';
import { getTimeZone } from '@/lib/time-zone';

export const dashboardKeys = {
  // Nested under the learning keys so completing a lesson refreshes the stats too.
  stats: (days: number) => [...lessonKeys.all, 'stats', days] as const,
};

export function useStatsQuery(days: number) {
  return useQuery({
    queryKey: dashboardKeys.stats(days),
    queryFn: () =>
      http
        .get<UserStats>('/me/stats', { params: { days, timeZone: getTimeZone() } })
        .then((res) => res.data),
  });
}
