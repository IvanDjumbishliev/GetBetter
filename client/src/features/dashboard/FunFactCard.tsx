import { Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopicsQuery } from '@/features/lessons/lessonsApi';
import { todayKey } from '@/lib/time-zone';
import { getDailyFact } from './dailyFact';

export function FunFactCard() {
  const [date, setDate] = useState(todayKey);
  const topicsQuery = useTopicsQuery();
  const enrolledCategory = topicsQuery.data?.find((topic) => topic.isEnrolled)?.category.name;
  const fact = getDailyFact(date, enrolledCategory);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = window.setTimeout(
      () => setDate(todayKey()),
      nextMidnight.getTime() - now.getTime(),
    );

    return () => window.clearTimeout(timer);
  }, [date]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lightbulb aria-hidden className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle>Fun fact of the day</CardTitle>
            <CardDescription>{fact.category} · A fresh curiosity every day</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{fact.text}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <a
            href={fact.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Source: {fact.source}
          </a>
          <a
            href="https://learn-anything.xyz/"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Explore topics on Learn Anything
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
