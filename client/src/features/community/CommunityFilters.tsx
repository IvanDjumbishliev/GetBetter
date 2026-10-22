import type { CategorySummary, TopicSummary } from '@shared/types';

import { NativeSelect } from '@/components/ui/native-select';
import { CategoryIcon } from '@/features/lessons/CategoryIcon';
import { cn } from '@/lib/utils';
import type { PostsFilter } from './communityApi';

interface CommunityFiltersProps {
  topics: TopicSummary[];
  filter: PostsFilter;
  onChange: (filter: PostsFilter) => void;
}

interface CategoryGroup {
  category: CategorySummary;
  topics: TopicSummary[];
}

function groupByCategory(topics: TopicSummary[]): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();
  for (const topic of topics) {
    const group = groups.get(topic.category.id) ?? { category: topic.category, topics: [] };
    group.topics.push(topic);
    groups.set(topic.category.id, group);
  }
  return [...groups.values()];
}

// Encodes a filter as one <select> value for the mobile control.
const toValue = (filter: PostsFilter) =>
  filter.topicId
    ? `topic:${filter.topicId}`
    : filter.categoryId
      ? `category:${filter.categoryId}`
      : '';
const fromValue = (value: string): PostsFilter => {
  const [kind, id] = value.split(':');
  return kind === 'topic' ? { topicId: id } : kind === 'category' ? { categoryId: id } : {};
};

export function CommunityFilters({ topics, filter, onChange }: CommunityFiltersProps) {
  const groups = groupByCategory(topics);
  const isAll = !filter.topicId && !filter.categoryId;

  return (
    <>
      <NativeSelect
        aria-label="Filter discussions"
        className="w-full md:hidden"
        value={toValue(filter)}
        onChange={(event) => onChange(fromValue(event.target.value))}
      >
        <option value="">All discussions</option>
        {groups.map(({ category, topics }) => (
          <optgroup key={category.id} label={category.name}>
            <option value={`category:${category.id}`}>All of {category.name}</option>
            {topics.map((topic) => (
              <option key={topic.id} value={`topic:${topic.id}`}>
                {topic.title}
              </option>
            ))}
          </optgroup>
        ))}
      </NativeSelect>

      <nav aria-label="Filter discussions" className="hidden space-y-4 text-sm md:block">
        <FilterButton active={isAll} onClick={() => onChange({})}>
          All discussions
        </FilterButton>
        {groups.map(({ category, topics }) => (
          <div key={category.id} className="space-y-1">
            <FilterButton
              active={filter.categoryId === category.id}
              onClick={() => onChange({ categoryId: category.id })}
              className="font-semibold"
            >
              <CategoryIcon category={category} className="h-4 w-4 text-muted-foreground" />
              {category.name}
            </FilterButton>
            <ul className="ml-4 space-y-0.5 border-l pl-2">
              {topics.map((topic) => (
                <li key={topic.id}>
                  <FilterButton
                    active={filter.topicId === topic.id}
                    onClick={() => onChange({ topicId: topic.id })}
                    className="text-muted-foreground"
                  >
                    {topic.title}
                  </FilterButton>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, className, children }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
        active && 'bg-accent font-medium text-foreground',
      )}
    >
      {children}
    </button>
  );
}
