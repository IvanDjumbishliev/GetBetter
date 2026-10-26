import type { PostSummary, TopicSummary } from '@shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { FileText, Layers, Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { communityKeys } from '@/features/community/communityApi';
import { lessonKeys } from '@/features/lessons/lessonsApi';
import { useCommandPalette } from '@/stores/command-palette';
import { cn } from '@/lib/utils';

type FeedPage = { posts: PostSummary[] };
type FeedData = { pages: FeedPage[] };

type PaletteItem = { kind: 'topic'; topic: TopicSummary } | { kind: 'post'; post: PostSummary };

function cachedTopics(queryClient: ReturnType<typeof useQueryClient>): TopicSummary[] {
  return queryClient.getQueryData<TopicSummary[]>(lessonKeys.topics()) ?? [];
}

function cachedPosts(queryClient: ReturnType<typeof useQueryClient>): PostSummary[] {
  const seen = new Set<string>();
  const posts: PostSummary[] = [];
  for (const [, data] of queryClient.getQueriesData<FeedData>({
    queryKey: communityKeys.feeds(),
  })) {
    for (const page of data?.pages ?? []) {
      for (const post of page.posts) {
        if (!seen.has(post.id)) {
          seen.add(post.id);
          posts.push(post);
        }
      }
    }
  }
  return posts;
}

export function CommandPalette() {
  const isOpen = useCommandPalette((s) => s.isOpen);
  const close = useCommandPalette((s) => s.close);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const closePalette = useCallback(() => {
    setQuery('');
    setActive(0);
    close();
  }, [close]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) closePalette();
        else useCommandPalette.getState().open();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePalette, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  const needle = query.trim().toLowerCase();
  const topicHits: PaletteItem[] = cachedTopics(queryClient)
    .filter(
      (topic) =>
        !needle ||
        [topic.title, topic.description ?? '', topic.category.name].some((text) =>
          text.toLowerCase().includes(needle),
        ),
    )
    .slice(0, 8)
    .map((topic) => ({ kind: 'topic', topic }));
  const postHits: PaletteItem[] = cachedPosts(queryClient)
    .filter(
      (post) =>
        !needle ||
        [post.title, post.excerpt, post.author.displayName].some((text) =>
          text.toLowerCase().includes(needle),
        ),
    )
    .slice(0, 8)
    .map((post) => ({ kind: 'post', post }));
  const items = [...topicHits, ...postHits];

  const go = (item: PaletteItem) => {
    closePalette();
    if (item.kind === 'topic') navigate(`/topics/${item.topic.slug}`);
    else navigate(`/community/${item.post.id}`);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? useCommandPalette.getState().open() : closePalette())}
    >
      <DialogContent className="top-[18%] translate-y-0 gap-0 overflow-hidden border-border p-0 shadow-[var(--gb-shadow-overlay)] sm:max-w-lg sm:rounded-lg [&>button.absolute]:hidden">
        <DialogTitle className="sr-only">Search topics and posts</DialogTitle>
        <DialogDescription className="sr-only">
          Type to search cached topics and community posts. Press Enter to open a result.
        </DialogDescription>
        <div className="flex items-center gap-2 border-b px-3">
          <Search aria-hidden className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setActive((i) => Math.min(i + 1, Math.max(items.length - 1, 0)));
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (event.key === 'Enter') {
                const item = items[active];
                if (item) go(item);
              }
            }}
            placeholder="Search topics and posts…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search topics and posts"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2" role="listbox">
          {items.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground">
              {query.trim()
                ? 'No matching topics or posts in cache.'
                : 'Browse Explore or Community to cache results, then search here.'}
            </li>
          )}
          {items.map((item, index) => (
            <li key={item.kind === 'topic' ? `topic-${item.topic.id}` : `post-${item.post.id}`}>
              <button
                type="button"
                role="option"
                aria-selected={index === active}
                className={cn(
                  'flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm hover:bg-secondary',
                  index === active && 'bg-secondary',
                )}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(item)}
              >
                {item.kind === 'topic' ? (
                  <>
                    <Layers aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0">
                      <span className="block font-medium">{item.topic.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        Topic · {item.topic.category.name}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <FileText aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                    <span className="min-w-0">
                      <span className="block font-medium">{item.post.title}</span>
                      <span className="block text-xs text-muted-foreground">
                        Post · {item.post.author.displayName}
                      </span>
                    </span>
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
