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
  flashcards: { id: string; front: string; back: string }[];
  /** Correct answers and explanations are deliberately not sent to the client. */
  quizQuestions: { id: string; question: string; options: QuizOption[] }[];
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
