import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Enter a valid email address' }));

export const registerSchema = z.object({
  email,
  // bcrypt only uses the first 72 bytes of a password.
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters' })
    .max(72, { error: 'Password must be at most 72 characters' }),
  displayName: z
    .string()
    .trim()
    .min(1, { error: 'Display name is required' })
    .max(50, { error: 'Display name must be at most 50 characters' }),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: 'Password is required' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** IANA time zone (e.g. "Europe/Sofia") used to decide what "today" means for streaks. */
export const timeZoneSchema = z
  .string()
  .refine(isValidTimeZone, { error: 'Invalid time zone' })
  .optional();

export const completeLessonSchema = z.object({ timeZone: timeZoneSchema });
export const dailyLessonQuerySchema = z.object({ timeZone: timeZoneSchema });

export type CompleteLessonInput = z.infer<typeof completeLessonSchema>;

export const quizAnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOptionId: z.string().min(1),
});

export const createQuizAttemptSchema = z.object({
  lessonId: z.string().min(1, { error: 'lessonId is required' }),
  answers: z.array(quizAnswerSchema).min(1, { error: 'At least one answer is required' }).max(100),
  /** Accepted for convenience but ignored: the server always grades the answers itself. */
  score: z.number().optional(),
});

export const quizAttemptsQuerySchema = z.object({
  lessonId: z.string().min(1, { error: 'lessonId is required' }),
});

export type CreateQuizAttemptInput = z.infer<typeof createQuizAttemptSchema>;

export const STATS_DEFAULT_DAYS = 30;
export const STATS_MAX_DAYS = 366;

export const statsQuerySchema = z.object({
  timeZone: timeZoneSchema,
  /** How many days of activity to return, ending today. */
  days: z.coerce.number().int().min(1).max(STATS_MAX_DAYS).default(STATS_DEFAULT_DAYS),
});

export const createPostSchema = z.object({
  topicId: z.string().min(1).nullish(),
  title: z
    .string()
    .trim()
    .min(3, { error: 'Title must be at least 3 characters' })
    .max(150, { error: 'Title must be at most 150 characters' }),
  body: z
    .string()
    .trim()
    .min(1, { error: 'Write something before posting' })
    .max(10_000, { error: 'Post must be at most 10,000 characters' }),
});

export const createCommentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, { error: 'Comment cannot be empty' })
    .max(5_000, { error: 'Comment must be at most 5,000 characters' }),
});

export const postsQuerySchema = z.object({
  topicId: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type PostsQuery = z.infer<typeof postsQuerySchema>;
