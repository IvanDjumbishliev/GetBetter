import type { PostSummary } from '@shared/types';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router';

import { TimeAgo } from '@/components/TimeAgo';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/UserAvatar';

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="relative rounded-xl border bg-card p-5 transition-colors hover:border-primary/40">
      <header className="flex items-center gap-3">
        <UserAvatar user={post.author} />
        <div className="min-w-0 flex-1 text-sm">
          <p className="truncate font-medium">{post.author.displayName}</p>
          <TimeAgo date={post.createdAt} className="text-xs text-muted-foreground" />
        </div>
        {post.topic && (
          <Badge variant="secondary" className="relative z-10 shrink-0">
            {/* Above the card-wide link so the tag has its own target. */}
            <Link to={`/community?topicId=${post.topic.id}`}>{post.topic.title}</Link>
          </Badge>
        )}
      </header>
      <h2 className="mt-3 text-lg font-semibold leading-snug">
        {/* The stretched ::after makes the whole card clickable without nesting interactive elements. */}
        <Link
          to={`/community/${post.id}`}
          className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
        >
          {post.title}
        </Link>
      </h2>
      {post.excerpt && <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>}
      <footer className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MessageSquare aria-hidden className="h-3.5 w-3.5" />
        {post.commentCount} {post.commentCount === 1 ? 'comment' : 'comments'}
      </footer>
    </article>
  );
}
