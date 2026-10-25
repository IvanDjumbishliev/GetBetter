import type { CategoryProgress as CategoryProgressItem } from '@shared/types';

import { ProgressBar } from '@/components/ProgressBar';
import { colors } from '@/design-system/tokens';
import { CategoryIcon } from '@/features/lessons/CategoryIcon';

const percent = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 0 });

export function CategoryProgress({ categories }: { categories: CategoryProgressItem[] }) {
  if (categories.length === 0) {
    return <p className="text-sm text-muted-foreground">No categories yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {categories.map((category) => {
        const ratio = category.totalLessons ? category.lessonsCompleted / category.totalLessons : 0;
        return (
          <li key={category.categorySlug} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <CategoryIcon
                  category={{
                    slug: category.categorySlug,
                    name: category.categoryName,
                    iconUrl: null,
                  }}
                  className="h-4 w-4 text-muted-foreground"
                />
                {category.categoryName}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {category.lessonsCompleted} / {category.totalLessons}
                <span className="ml-2 inline-block w-9 text-right">{percent.format(ratio)}</span>
              </span>
            </div>
            <ProgressBar
              value={ratio * 100}
              color={colors.accent}
              label={`${category.categoryName}: ${category.lessonsCompleted} of ${category.totalLessons} lessons completed`}
            />
          </li>
        );
      })}
    </ul>
  );
}
