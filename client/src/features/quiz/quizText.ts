/** "A", "B", "C", ... for option index 0, 1, 2, ... */
export const optionLetter = (index: number) => String.fromCharCode(65 + index);

/** Motivational message for a quiz score (fraction correct, 0–1). */
export function getScoreMessage(score: number): { title: string; message: string } {
  if (score >= 1) {
    return { title: 'Perfect score!', message: "You've mastered this lesson. Outstanding work." };
  }
  if (score >= 0.8) {
    return { title: 'Great job!', message: "You've got a strong grasp of this material." };
  }
  if (score >= 0.5) {
    return {
      title: 'Good effort!',
      message: "You're getting there. A quick review will lock it in.",
    };
  }
  return {
    title: 'Keep going!',
    message: 'Every attempt makes it stick. Review the explanations below and try again.',
  };
}
