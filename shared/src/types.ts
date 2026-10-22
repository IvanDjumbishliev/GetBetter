import type { ErrorCode } from './constants';

export interface HealthResponse {
  status: 'ok';
  message: string;
  database: 'up' | 'down';
  timestamp: string;
}

export interface ApiErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    details?: { path: string; message: string }[];
  };
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
}

export interface TopicSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  estimatedMinutes: number;
  lessonCount: number;
  enrollmentCount: number;
  isEnrolled: boolean;
  category: CategorySummary;
}

export interface TopicLessonItem {
  id: string;
  order: number;
  title: string;
  summary: string | null;
  readMinutes: number;
  isCompleted: boolean;
}

export interface TopicDetail extends TopicSummary {
  enrolledAt: string | null;
  completedAt: string | null;
  completedLessonCount: number;
  lessons: TopicLessonItem[];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface LessonNavItem {
  id: string;
  order: number;
  title: string;
}

export interface LessonDetail {
  id: string;
  order: number;
  title: string;
  summary: string | null;
  content: string;
  readMinutes: number;
  isCompleted: boolean;
  topic: { id: string; slug: string; title: string; category: CategorySummary };
  flashcards: Flashcard[];
  /**
   * Includes answers so the quiz can give instant feedback. Scores are still graded
   * server-side when an attempt is submitted, so they can't be forged.
   */
  quizQuestions: QuizQuestion[];
  previousLesson: LessonNavItem | null;
  nextLesson: LessonNavItem | null;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  /** Calendar date (YYYY-MM-DD) of the user's last completed lesson. */
  lastActivityDate: string | null;
}

export interface EnrollResponse {
  enrolledAt: string;
  completedAt: string | null;
  alreadyEnrolled: boolean;
}

export interface CompleteLessonResponse {
  lessonId: string;
  completedAt: string;
  alreadyCompleted: boolean;
  /** True once every lesson in the topic is complete. */
  topicCompleted: boolean;
  /** False when the user had already been active today (or re-completed a lesson). */
  streakChanged: boolean;
  streak: StreakInfo;
}

export interface DailyLesson {
  /** "continue": next lesson in an enrolled topic. "recommended": from the most popular other topic. */
  reason: 'continue' | 'recommended';
  /** Whether the user already completed a lesson today (in their time zone). */
  completedToday: boolean;
  lesson: { id: string; order: number; title: string; summary: string | null; readMinutes: number };
  topic: {
    id: string;
    slug: string;
    title: string;
    lessonCount: number;
    category: CategorySummary;
  };
}

export interface DailyLessonResponse {
  dailyLesson: DailyLesson | null;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizAttemptResult {
  id: string;
  /** Fraction of questions answered correctly, 0–1. */
  score: number;
  correctCount: number;
  totalCount: number;
  attemptedAt: string;
}

export interface QuizAttempt extends QuizAttemptResult {
  lessonId: string;
  answers: QuizAnswer[];
}

export interface QuizAttemptsResponse {
  attempts: QuizAttempt[];
}

export interface DailyActivity {
  /** Calendar date (YYYY-MM-DD) in the requested time zone. */
  date: string;
  lessonsCompleted: number;
}

export interface CategoryProgress {
  categoryName: string;
  categorySlug: string;
  lessonsCompleted: number;
  totalLessons: number;
}

export interface UserStats {
  /** 0 if the streak has lapsed (no activity today or yesterday), even before the next lesson resets it. */
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalTopicsEnrolled: number;
  totalQuizzesTaken: number;
  /** Mean of all quiz attempt scores, 0–1 (0 when no quizzes have been taken). */
  averageQuizScore: number;
  /** One entry per day, oldest first, ending today; days without activity are included as 0. */
  weeklyActivity: DailyActivity[];
  categoryBreakdown: CategoryProgress[];
}
