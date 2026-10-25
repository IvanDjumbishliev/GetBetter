import type { CategorySummary, Difficulty, TopicSummary } from '@shared/types';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { QueryError } from '@/components/QueryError';
import { TopicCard } from '@/components/TopicCard';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryIcon } from './CategoryIcon';
import { DIFFICULTY_LABELS } from './difficulty';
import { useTopicsQuery } from './lessonsApi';

const ALL = 'all';

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

export function TopicsPage() {
  const topicsQuery = useTopicsQuery();
  const [searchParams] = useSearchParams();
  const enrolledOnly = searchParams.get('enrolled') === '1';
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState(ALL);
  const [difficulty, setDifficulty] = useState<Difficulty | typeof ALL>(ALL);

  const topics = topicsQuery.data;
  const categories = useMemo(
    () => groupByCategory(topics ?? []).map((group) => group.category),
    [topics],
  );

  const groups = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = (topics ?? []).filter(
      (topic) =>
        (!enrolledOnly || topic.isEnrolled) &&
        (categoryId === ALL || topic.category.id === categoryId) &&
        (difficulty === ALL || topic.difficulty === difficulty) &&
        (!query ||
          [topic.title, topic.description ?? '', topic.category.name].some((text) =>
            text.toLowerCase().includes(query),
          )),
    );
    return groupByCategory(filtered);
  }, [topics, search, categoryId, difficulty, enrolledOnly]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl tracking-tight">
          {enrolledOnly ? 'My Learning' : 'Explore'}
        </h1>
        <p className="text-muted-foreground">
          {enrolledOnly
            ? 'Topics you are enrolled in — pick up the next lesson and keep the streak.'
            : 'Pick something new to learn, one lesson a day.'}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row" role="search">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search topics…"
            aria-label="Search topics"
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <NativeSelect
          aria-label="Filter by category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value={ALL}>All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          aria-label="Filter by difficulty"
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value as Difficulty | typeof ALL)}
        >
          <option value={ALL}>All levels</option>
          {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {topicsQuery.isPending && <TopicsSkeleton />}
      {topicsQuery.isError && (
        <QueryError error={topicsQuery.error} onRetry={() => void topicsQuery.refetch()} />
      )}
      {topicsQuery.isSuccess && groups.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          {enrolledOnly ? 'You have not enrolled in any matching topics yet.' : 'No topics match your filters.'}
        </p>
      )}

      {groups.map(({ category, topics: groupTopics }) => (
        <section
          key={category.id}
          aria-labelledby={`category-${category.id}`}
          className="space-y-4"
        >
          <h2
            id={`category-${category.id}`}
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <CategoryIcon category={category} className="text-muted-foreground" />
            {category.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TopicsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading topics">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-44 rounded-lg" />
      ))}
    </div>
  );
}
