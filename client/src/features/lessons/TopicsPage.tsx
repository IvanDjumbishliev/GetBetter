import type { CategorySummary, Difficulty, TopicSummary } from '@shared/types';
import { CircleCheck, Clock, Layers, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import { QueryError } from '@/components/QueryError';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryIcon } from './CategoryIcon';
import { DIFFICULTY_LABELS } from './difficulty';
import { DifficultyBadge } from './DifficultyBadge';
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
        (categoryId === ALL || topic.category.id === categoryId) &&
        (difficulty === ALL || topic.difficulty === difficulty) &&
        (!query ||
          [topic.title, topic.description ?? '', topic.category.name].some((text) =>
            text.toLowerCase().includes(query),
          )),
    );
    return groupByCategory(filtered);
  }, [topics, search, categoryId, difficulty]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Explore topics</h1>
        <p className="text-muted-foreground">Pick something new to learn, one lesson a day.</p>
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
        <p className="py-12 text-center text-muted-foreground">No topics match your filters.</p>
      )}

      {groups.map(({ category, topics }) => (
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
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TopicCard({ topic }: { topic: TopicSummary }) {
  return (
    <Link
      to={`/topics/${topic.slug}`}
      className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="flex h-full flex-col transition-colors group-hover:border-primary/40">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={topic.difficulty} />
            {topic.isEnrolled && (
              <Badge variant="secondary">
                <CircleCheck aria-hidden className="h-3 w-3" />
                Enrolled
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg">{topic.title}</CardTitle>
          {topic.description && (
            <CardDescription className="line-clamp-2">{topic.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers aria-hidden className="h-3.5 w-3.5" />
            {topic.lessonCount} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock aria-hidden className="h-3.5 w-3.5" />~{topic.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Users aria-hidden className="h-3.5 w-3.5" />
            {topic.enrollmentCount} enrolled
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}

function TopicsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading topics">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} className="h-44 rounded-xl" />
      ))}
    </div>
  );
}
