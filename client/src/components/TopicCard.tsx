import type { TopicSummary } from '@shared/types';
import { CircleCheck, Layers } from 'lucide-react';
import { Link } from 'react-router';

import { coverColorForCategory } from '@/design-system/tokens';
import { DifficultyBadge } from '@/features/lessons/DifficultyBadge';
import { cn } from '@/lib/utils';

interface TopicCardProps {
  topic: TopicSummary;
  className?: string;
}

export function TopicCard({ topic, className }: TopicCardProps) {
  const cover = coverColorForCategory(topic.category.slug);

  return (
    <Link
      to={`/topics/${topic.slug}`}
      className={cn(
        'group block rounded-lg border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <span className="block h-1.5 rounded-t-[7px]" style={{ backgroundColor: cover }} aria-hidden />
      <div className="flex h-[calc(100%-0.375rem)] flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={topic.difficulty} />
          {topic.isEnrolled && (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
              <CircleCheck aria-hidden className="h-3 w-3" />
              Enrolled
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold leading-snug tracking-tight group-hover:text-primary">
          {topic.title}
        </h3>
        {topic.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>
        )}
        <p className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <Layers aria-hidden className="h-3.5 w-3.5" />
          {topic.lessonCount} {topic.lessonCount === 1 ? 'lesson' : 'lessons'}
        </p>
      </div>
    </Link>
  );
}
