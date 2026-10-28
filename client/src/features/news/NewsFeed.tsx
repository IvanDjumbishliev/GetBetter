import { ExternalLink, Newspaper } from 'lucide-react';

import { QueryError } from '@/components/QueryError';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewsQuery } from './newsApi';

interface NewsFeedProps {
  discipline?: string;
  limit?: number;
  compact?: boolean;
}

export function NewsFeed({ discipline = 'technology', limit = 5, compact = false }: NewsFeedProps) {
  const query = useNewsQuery(discipline);

  if (query.isPending) {
    return <Skeleton className="h-44 w-full rounded-xl" aria-label="Loading news" />;
  }

  if (query.isError) {
    return <QueryError error={query.error} onRetry={() => void query.refetch()} />;
  }

  const items = query.data ?? [];

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          No recent headlines right now. Check back in a few minutes.
        </p>
      ) : (
        items.slice(0, limit).map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/60 hover:bg-secondary/40"
          >
            <div className="mb-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Newspaper className="h-3.5 w-3.5" />
                {item.source}
              </span>
              <time>{new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time>
            </div>
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            {!compact && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>}
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Read more <ExternalLink className="h-3 w-3" />
            </span>
          </a>
        ))
      )}
    </div>
  );
}
