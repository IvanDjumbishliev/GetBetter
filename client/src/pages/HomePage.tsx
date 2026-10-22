import { APP_NAME } from '@shared/constants';
import type { HealthResponse } from '@shared/types';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { useLogoutMutation, useMeQuery } from '@/features/auth/authApi';
import { useAuth } from '@/features/auth/useAuth';
import { http } from '@/lib/http';

export function HomePage() {
  const user = useAuth((s) => s.user);
  const logout = useLogoutMutation();
  // Protected call: exercises the access token + silent refresh on 401.
  const me = useMeQuery();
  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => http.get<HealthResponse>('/health').then((res) => res.data),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">
        Hello, {user?.displayName ?? 'learner'}!
      </h1>
      <p className="text-muted-foreground">Welcome to {APP_NAME}.</p>

      <section className="w-full max-w-md rounded-lg border bg-card p-4 text-sm">
        <h2 className="mb-2 font-semibold">Status</h2>
        <ul className="space-y-1">
          <li>
            API:{' '}
            {health.isSuccess ? health.data.message : health.isError ? 'unreachable' : 'checking…'}
          </li>
          <li>Database: {health.data?.database ?? '…'}</li>
          <li>
            Session: {me.isSuccess ? `verified as ${me.data.email}` : me.isError ? 'invalid' : '…'}
          </li>
        </ul>
      </section>

      <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
        Log out
      </Button>
    </main>
  );
}
