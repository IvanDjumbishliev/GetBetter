import type { PostSummary } from '@shared/types';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';

import { QueryError } from '@/components/QueryError';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopicsQuery } from '@/features/lessons/lessonsApi';
import { matchesFilter, usePostsFeed, type PostsFilter } from './communityApi';
import { CommunityFilters } from './CommunityFilters';
import { NewPostModal } from './NewPostModal';
import { PostCard } from './PostCard';

export function CommunityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter: PostsFilter = useMemo(() => {
    const topicId = searchParams.get('topicId') ?? undefined;
    const categoryId = searchParams.get('categoryId') ?? undefined;
    return topicId ? { topicId } : categoryId ? { categoryId } : {};
  }, [searchParams]);

  const topics = useTopicsQuery().data ?? [];
  const feed = usePostsFeed(filter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Offset pages can overlap when posts are added between fetches, so drop repeats.
  const posts = useMemo(() => {
    const seen = new Set<string>();
    return (feed.data?.pages ?? [])
      .flatMap((page) => page.posts)
      .filter((post) => !seen.has(post.id) && seen.add(post.id));
  }, [feed.data]);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = feed;
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage) return;
    // Re-created after each page loads, so it fires again if the sentinel is still on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void fetchNextPage();
      },
      { rootMargin: '400px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const setFilter = (next: PostsFilter) => {
    const params = new URLSearchParams();
    if (next.topicId) params.set('topicId', next.topicId);
    else if (next.categoryId) params.set('categoryId', next.categoryId);
    setSearchParams(params);
  };

  const onCreated = (post: PostSummary) => {
    // The new post was prepended to matching feeds; if this one doesn't match, show all.
    if (!matchesFilter(post, filter)) setFilter({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heading = filter.topicId
    ? topics.find((t) => t.id === filter.topicId)?.title
    : filter.categoryId
      ? topics.find((t) => t.category.id === filter.categoryId)?.category.name
      : undefined;

  return (
    <div className="grid gap-8 md:grid-cols-[15rem_1fr]">
      <aside className="md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:self-start md:overflow-y-auto">
        <CommunityFilters topics={topics} filter={filter} onChange={setFilter} />
      </aside>

      <section aria-labelledby="community-heading" className="min-w-0 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 id="community-heading" className="text-3xl font-bold tracking-tight">
              Community
            </h1>
            <p className="text-muted-foreground">
              {heading ? `Discussions about ${heading}` : 'Ask questions and share what you learn.'}
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus aria-hidden />
            New Post
          </Button>
        </div>

        {feed.isPending && (
          <div className="space-y-4" aria-label="Loading posts">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        )}
        {feed.isError && <QueryError error={feed.error} onRetry={() => void feed.refetch()} />}
        {feed.isSuccess && posts.length === 0 && (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <p className="font-medium">No posts here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Start the conversation!</p>
          </div>
        )}

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>

        <div ref={sentinelRef} aria-hidden />
        {isFetchingNextPage && (
          <p
            role="status"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
            Loading more posts…
          </p>
        )}
        {/* Fallback for when the observer doesn't fire (e.g. keyboard users, old browsers). */}
        {hasNextPage && !isFetchingNextPage && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => void fetchNextPage()}>
              Load more
            </Button>
          </div>
        )}
        {feed.isSuccess && posts.length > 0 && !hasNextPage && (
          <p className="text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
        )}
      </section>

      <NewPostModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultTopicId={filter.topicId}
        onCreated={onCreated}
      />
    </div>
  );
}
