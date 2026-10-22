import { APP_NAME } from '@shared/constants';
import type { HealthResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { apiGet } from '@/lib/api';
import { useCounterStore } from '@/stores/counter-store';

export function HelloWorld() {
  const { count, increment } = useCounterStore();
  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => apiGet<HealthResponse>('/health'),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Hello World from {APP_NAME}</h1>

      <section className="w-full max-w-md rounded-lg border bg-card p-4 text-sm">
        <h2 className="mb-2 font-semibold">API status</h2>
        {health.isPending && <p className="text-muted-foreground">Checking…</p>}
        {health.isError && <p className="text-destructive">Unreachable: {health.error.message}</p>}
        {health.isSuccess && (
          <ul className="space-y-1">
            <li>Message: {health.data.message}</li>
            <li>Database: {health.data.database}</li>
          </ul>
        )}
      </section>

      <Button onClick={increment}>Zustand count: {count}</Button>
    </main>
  );
}
