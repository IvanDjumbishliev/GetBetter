import { createCommentSchema } from '@shared/schemas';
import type { PostAuthor, PostComment } from '@shared/types';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { MarkdownContent } from '@/components/MarkdownContent';
import { QueryError } from '@/components/QueryError';
import { TimeAgo } from '@/components/TimeAgo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { UserAvatar } from '@/components/UserAvatar';
import { useAuth } from '@/features/auth/useAuth';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useDeletePostMutation,
  usePostQuery,
} from './communityApi';

/** Mirrors the server rule: authors and admins can delete. */
function useCanDelete() {
  const user = useAuth((s) => s.user);
  return (author: PostAuthor) => !!user && (user.id === author.id || user.role === 'ADMIN');
}

export function PostDetailPage() {
  const { postId = '' } = useParams();
  const postQuery = usePostQuery(postId);
  const navigate = useNavigate();
  const canDelete = useCanDelete();
  const deletePost = useDeletePostMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (postQuery.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-label="Loading post">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  if (postQuery.isError) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <BackLink />
        <QueryError error={postQuery.error} onRetry={() => void postQuery.refetch()} />
      </div>
    );
  }

  const post = postQuery.data;
  return (
    <div className="mx-auto max-w-3xl">
      <article className="space-y-6">
        <BackLink />
        <header className="space-y-4">
          {post.topic && (
            <Badge variant="secondary">
              <Link to={`/community?topicId=${post.topic.id}`}>{post.topic.title}</Link>
            </Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-3">
            <UserAvatar user={post.author} />
            <div className="flex-1 text-sm">
              <p className="font-medium">{post.author.displayName}</p>
              <TimeAgo date={post.createdAt} className="text-xs text-muted-foreground" />
            </div>
            {canDelete(post.author) && (
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 aria-hidden />
                Delete post
              </Button>
            )}
          </div>
        </header>
        <MarkdownContent>{post.body}</MarkdownContent>
      </article>

      <CommentsSection postId={post.id} comments={post.comments} />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this post?"
        description="The post and all of its comments will be permanently removed."
        confirmLabel="Delete post"
        isPending={deletePost.isPending}
        onConfirm={() =>
          deletePost.mutate(post.id, { onSuccess: () => navigate('/community', { replace: true }) })
        }
      />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/community"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft aria-hidden className="h-4 w-4" />
      Community
    </Link>
  );
}

function CommentsSection({ postId, comments }: { postId: string; comments: PostComment[] }) {
  const canDelete = useCanDelete();
  const addComment = useAddCommentMutation(postId);
  const deleteComment = useDeleteCommentMutation(postId);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PostComment | null>(null);
  const lastCommentId = useRef<string | null>(null);

  // Bring a freshly posted comment into view above the pinned composer.
  useEffect(() => {
    const id = lastCommentId.current;
    if (id) {
      document
        .getElementById(`comment-${id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      lastCommentId.current = null;
    }
  }, [comments]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const parsed = createCommentSchema.safeParse({ body });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid comment');
      return;
    }
    setError(null);
    addComment.mutate(parsed.data, {
      onSuccess: (comment) => {
        lastCommentId.current = comment.id;
        setBody('');
      },
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) submit();
  };

  return (
    <section aria-labelledby="comments-heading" className="mt-10 border-t pt-8">
      <h2 id="comments-heading" className="text-xl font-semibold">
        {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
      </h2>

      {comments.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No comments yet. Be the first to reply!
        </p>
      ) : (
        <ol className="mt-4 divide-y">
          {comments.map((comment) => (
            <li key={comment.id} id={`comment-${comment.id}`} className="flex gap-3 py-4">
              <UserAvatar user={comment.author} className="h-8 w-8" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{comment.author.displayName}</span>
                  <TimeAgo date={comment.createdAt} className="text-xs text-muted-foreground" />
                  {canDelete(comment.author) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-7 w-7 text-muted-foreground"
                      aria-label="Delete comment"
                      onClick={() => setPendingDelete(comment)}
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  )}
                </div>
                <MarkdownContent className="prose-sm">{comment.body}</MarkdownContent>
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* Pinned to the bottom of the viewport while the comments scroll. */}
      <form
        onSubmit={submit}
        className="sticky bottom-0 -mx-4 mt-6 space-y-2 border-t bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <label htmlFor="comment-body" className="sr-only">
          Write a comment
        </label>
        <Textarea
          id="comment-body"
          rows={3}
          placeholder="Write a comment… (Markdown supported)"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={onKeyDown}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'comment-error' : undefined}
        />
        <div className="flex items-center justify-between gap-3">
          <p id="comment-error" role="alert" className="text-sm text-destructive">
            {error ?? (addComment.isError ? getApiErrorMessage(addComment.error) : '')}
          </p>
          <Button type="submit" disabled={addComment.isPending || !body.trim()}>
            {addComment.isPending ? 'Posting…' : 'Post Comment'}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this comment?"
        description="This can't be undone."
        confirmLabel="Delete comment"
        isPending={deleteComment.isPending}
        onConfirm={() =>
          pendingDelete &&
          deleteComment.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }
      />
    </section>
  );
}
