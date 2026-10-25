import type { Difficulty } from '@shared/types';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DIFFICULTY_LABELS } from './difficulty';

const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  BEGINNER: 'border-emerald-400/40 text-emerald-300',
  INTERMEDIATE: 'border-sky-400/40 text-sky-300',
  ADVANCED: 'border-violet-400/40 text-violet-300',
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant="outline" className={cn(DIFFICULTY_CLASSES[difficulty])}>
      {DIFFICULTY_LABELS[difficulty]}
    </Badge>
  );
}
