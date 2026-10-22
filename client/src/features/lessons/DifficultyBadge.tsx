import type { Difficulty } from '@shared/types';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DIFFICULTY_LABELS } from './difficulty';

const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  BEGINNER: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400',
  INTERMEDIATE: 'border-amber-500/40 text-amber-700 dark:text-amber-400',
  ADVANCED: 'border-rose-500/40 text-rose-700 dark:text-rose-400',
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant="outline" className={cn(DIFFICULTY_CLASSES[difficulty])}>
      {DIFFICULTY_LABELS[difficulty]}
    </Badge>
  );
}
