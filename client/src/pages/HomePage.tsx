import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/useAuth';
import { DailyLessonCard } from '@/features/lessons/DailyLessonCard';

export function HomePage() {
  const user = useAuth((s) => s.user);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Hello, {user?.displayName ?? 'learner'}!
        </h1>
        <p className="text-muted-foreground">Ready to get a little better today?</p>
      </div>
      <DailyLessonCard />
      <Button asChild variant="link" className="px-0">
        <Link to="/topics">Browse all topics →</Link>
      </Button>
    </div>
  );
}
