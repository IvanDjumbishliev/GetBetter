import type { CategorySummary } from '@shared/types';
import {
  BookOpen,
  Cpu,
  FlaskConical,
  Landmark,
  Palette,
  PiggyBank,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

// Fallbacks for categories without an uploaded iconUrl, keyed by category slug.
const ICONS_BY_SLUG: Record<string, LucideIcon> = {
  science: FlaskConical,
  technology: Cpu,
  finance: PiggyBank,
  history: Landmark,
  design: Palette,
};

interface CategoryIconProps {
  category: Pick<CategorySummary, 'slug' | 'name' | 'iconUrl'>;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  if (category.iconUrl) {
    return <img src={category.iconUrl} alt="" className={cn('h-5 w-5', className)} />;
  }
  const Icon = ICONS_BY_SLUG[category.slug] ?? BookOpen;
  return <Icon aria-hidden className={cn('h-5 w-5', className)} />;
}
