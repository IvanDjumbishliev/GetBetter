import { createPostSchema } from '@shared/schemas';
import type { PostSummary } from '@shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { MarkdownContent } from '@/components/MarkdownContent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { useTopicsQuery } from '@/features/lessons/lessonsApi';
import { getApiErrorMessage } from '@/lib/api-error';
import { cn } from '@/lib/utils';
import { useCreatePostMutation } from './communityApi';

// The <select> uses "" for "no topic"; the API expects it omitted.
const postFormSchema = createPostSchema.extend({ topicId: z.string() });

interface NewPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Preselected topic (e.g. the feed's current filter), if the user is enrolled in it. */
  defaultTopicId?: string;
  onCreated: (post: PostSummary) => void;
}

export function NewPostModal({ open, onOpenChange, defaultTopicId, onCreated }: NewPostModalProps) {
  const enrolledTopics = (useTopicsQuery().data ?? []).filter((topic) => topic.isEnrolled);
  const createPost = useCreatePostMutation();
  const [isPreview, setIsPreview] = useState(false);
  const initialTopicId = enrolledTopics.some((t) => t.id === defaultTopicId) ? defaultTopicId! : '';

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postFormSchema),
    values: { title: '', body: '', topicId: initialTopicId },
    resetOptions: { keepDirtyValues: true },
  });

  const close = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
      setIsPreview(false);
      createPost.reset();
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = handleSubmit(({ topicId, ...values }) =>
    createPost.mutate(
      { ...values, topicId: topicId || undefined },
      {
        onSuccess: (post) => {
          close(false);
          onCreated(post);
        },
      },
    ),
  );

  const body = useWatch({ control, name: 'body' });

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
          <DialogDescription>Ask a question or share something you learned.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? 'post-title-error' : undefined}
              {...register('title')}
            />
            {errors.title && (
              <p id="post-title-error" className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-topic">Topic (optional)</Label>
            <NativeSelect id="post-topic" className="w-full" {...register('topicId')}>
              <option value="">General discussion</option>
              {enrolledTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </NativeSelect>
            {enrolledTopics.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Enroll in a topic to tag your post with it.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="post-body">Body</Label>
              <div
                className="flex rounded-md border p-0.5 text-xs"
                role="group"
                aria-label="Editor mode"
              >
                {(['Write', 'Preview'] as const).map((mode) => {
                  const active = (mode === 'Preview') === isPreview;
                  return (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setIsPreview(mode === 'Preview')}
                      className={cn(
                        'rounded px-2.5 py-1 transition-colors',
                        active
                          ? 'bg-secondary font-medium'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Kept mounted while previewing so react-hook-form keeps the value and focus target. */}
            <Textarea
              id="post-body"
              rows={8}
              placeholder="Markdown is supported: **bold**, _italic_, lists, `code`, [links](https://…)"
              className={cn(isPreview && 'hidden')}
              aria-invalid={errors.body ? true : undefined}
              aria-describedby={errors.body ? 'post-body-error' : undefined}
              {...register('body')}
            />
            {isPreview && (
              <div className="min-h-[13rem] rounded-md border px-3 py-2">
                {body.trim() ? (
                  <MarkdownContent className="prose-sm">{body}</MarkdownContent>
                ) : (
                  <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
                )}
              </div>
            )}
            {errors.body && (
              <p id="post-body-error" className="text-sm text-destructive">
                {errors.body.message}
              </p>
            )}
          </div>

          {createPost.isError && (
            <p role="alert" className="text-sm text-destructive">
              {getApiErrorMessage(createPost.error)}
            </p>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => close(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPost.isPending}>
              {createPost.isPending ? 'Posting…' : 'Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
