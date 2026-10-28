import { useMemo, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopicsQuery } from '@/features/lessons/lessonsApi';
import { NewsFeed } from './NewsFeed';

const DISCIPLINES = ['technology', 'science', 'finance', 'history', 'design'];

export function NewsPage() {
  const topicsQuery = useTopicsQuery();
  const enrolledDiscipline = useMemo(() => {
    const topic = topicsQuery.data?.find((entry) => DISCIPLINES.includes(entry.category.slug));
    return topic?.category.slug ?? 'technology';
  }, [topicsQuery.data]);

  const [discipline, setDiscipline] = useState(enrolledDiscipline);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl tracking-tight">News for your focus</h1>
        <p className="text-muted-foreground">
          Short, current updates from public news feeds tied to the discipline you are learning.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Choose a discipline</CardTitle>
          <CardDescription>Follow the news stream closest to the topics you are studying.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DISCIPLINES.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setDiscipline(entry)}
                className={
                  'rounded-full border px-3 py-1.5 text-sm transition-colors ' +
                  (discipline === entry
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-secondary text-foreground hover:border-primary/50')
                }
              >
                {entry[0]?.toUpperCase() + entry.slice(1)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <NewsFeed discipline={discipline} limit={8} />
    </div>
  );
}
