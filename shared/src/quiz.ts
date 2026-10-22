import type { QuizAnswer } from './types';

export interface QuizGrade {
  correctCount: number;
  totalCount: number;
  /** Fraction correct, 0–1. */
  score: number;
}

/**
 * Grades answers against a lesson's questions. Unanswered questions count as wrong, so the
 * total is always the number of questions. Used by the server (authoritative) and the client
 * (instant results).
 */
export function gradeQuiz(
  questions: { id: string; correctOptionId: string }[],
  answers: QuizAnswer[],
): QuizGrade {
  const selected = new Map(answers.map((a) => [a.questionId, a.selectedOptionId]));
  const correctCount = questions.filter((q) => selected.get(q.id) === q.correctOptionId).length;
  const totalCount = questions.length;
  return { correctCount, totalCount, score: totalCount ? correctCount / totalCount : 0 };
}
