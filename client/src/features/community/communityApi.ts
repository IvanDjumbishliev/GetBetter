import { POSTS_PAGE_SIZE } from '@shared/constants';
import type { CreateCommentInput, CreatePostInput } from '@shared/schemas';
import type { PostComment, PostDetail, PostsPage, PostSummary } from '@shared/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query';

import { http } from '@/lib/http';

export interface PostsFilter {
  topicId?: string;
  categoryId?: string;
}

export const communityKeys = {
  all: ['community'] as const,
  feeds: () => [...communityKeys.all, 'feed'] as const,
  feed: (filter: PostsFilter) => [...communityKeys.feeds(), filter] as const,
  post: (id: string) => [...communityKeys.all, 'post', id] as const,
};

type FeedData = InfiniteData<PostsPage, number>;

export function matchesFilter(post: PostSummary, filter: PostsFilter): boolean {
  if (filter.topicId) return post.topic?.id === filter.topicId;
  if (filter.categoryId) return post.topic?.categoryId === filter.categoryId;
  return true;
}

/** Applies `update` to every cached feed (each filter has its own infinite query). */
function updateFeeds(
  queryClient: QueryClient,
  update: (data: FeedData, filter: PostsFilter) => FeedData,
) {
  for (const [key, data] of queryClient.getQueriesData<FeedData>({
    queryKey: communityKeys.feeds(),
  })) {
    if (data) queryClient.setQueryData(key, update(data, key[2] as PostsFilter));
  }
}

const mapFeedPosts = (data: FeedData, fn: (posts: PostSummary[]) => PostSummary[]): FeedData => ({
  ...data,
  pages: data.pages.map((page) => ({ ...page, posts: fn(page.posts) })),
});

export function usePostsFeed(filter: PostsFilter) {
  return useInfiniteQuery({
    queryKey: communityKeys.feed(filter),
    queryFn: ({ pageParam }) =>
      http
        .get<PostsPage>('/posts', {
          params: { ...filter, page: pageParam, limit: POSTS_PAGE_SIZE },
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
}

export function usePostQuery(id: string) {
  return useQuery({
    queryKey: communityKeys.post(id),
    queryFn: () =>
      http
        .get<{ post: PostDetail }>(`/posts/${encodeURIComponent(id)}`)
        .then((res) => res.data.post),
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) =>
      http.post<PostSummary>('/posts', input).then((res) => res.data),
    // Prepend to every cached feed the post belongs in, rather than refetching.
    onSuccess: (post) =>
      updateFeeds(queryClient, (data, filter) => {
        if (!matchesFilter(post, filter) || !data.pages[0]) return data;
        const [first, ...rest] = data.pages;
        return {
          ...data,
          pages: [{ ...first, posts: [post, ...first.posts], total: first.total + 1 }, ...rest],
        };
      }),
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => http.delete(`/posts/${encodeURIComponent(postId)}`),
    onSuccess: (_res, postId) => {
      updateFeeds(queryClient, (data) =>
        mapFeedPosts(data, (posts) => posts.filter((p) => p.id !== postId)),
      );
      queryClient.removeQueries({ queryKey: communityKeys.post(postId) });
    },
  });
}

function adjustCommentCount(queryClient: QueryClient, postId: string, delta: number) {
  updateFeeds(queryClient, (data) =>
    mapFeedPosts(data, (posts) =>
      posts.map((p) => (p.id === postId ? { ...p, commentCount: p.commentCount + delta } : p)),
    ),
  );
}

export function useAddCommentMutation(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCommentInput) =>
      http
        .post<PostComment>(`/posts/${encodeURIComponent(postId)}/comments`, input)
        .then((res) => res.data),
    onSuccess: (comment) => {
      queryClient.setQueryData<PostDetail>(communityKeys.post(postId), (post) =>
        post
          ? { ...post, comments: [...post.comments, comment], commentCount: post.commentCount + 1 }
          : post,
      );
      adjustCommentCount(queryClient, postId, 1);
    },
  });
}

export function useDeleteCommentMutation(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => http.delete(`/comments/${encodeURIComponent(commentId)}`),
    onSuccess: (_res, commentId) => {
      queryClient.setQueryData<PostDetail>(communityKeys.post(postId), (post) =>
        post
          ? {
              ...post,
              comments: post.comments.filter((c) => c.id !== commentId),
              commentCount: post.commentCount - 1,
            }
          : post,
      );
      adjustCommentCount(queryClient, postId, -1);
    },
  });
}
