import { ERROR_CODES } from '@shared/constants';
import type { OnboardingInput } from '@shared/schemas';
import type { AuthUser } from '@shared/types';
import { AppError } from '../../lib/errors';
import { prisma } from '../../lib/prisma';
import { toAuthUser } from '../auth/authService';

export async function completeOnboarding(
  userId: string,
  input: OnboardingInput,
): Promise<{ user: AuthUser; enrolledTopicIds: string[] }> {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.onboardingCompletedAt) {
      throw new AppError(409, ERROR_CODES.CONFLICT, 'Onboarding has already been completed');
    }

    const categories = await tx.category.findMany({
      where: { id: { in: input.selectedCategoryIds } },
      select: {
        id: true,
        topics: { where: { lessons: { some: {} } }, select: { id: true } },
      },
    });

    if (
      categories.length !== input.selectedCategoryIds.length ||
      categories.some((category) => category.topics.length === 0)
    ) {
      throw new AppError(
        400,
        ERROR_CODES.VALIDATION_ERROR,
        'Each selected category must contain at least one topic with lessons',
        [{ path: 'selectedCategoryIds', message: 'Choose available categories' }],
      );
    }

    const enrolledTopicIds = categories.map((category) => {
      const topic = category.topics[Math.floor(Math.random() * category.topics.length)];
      if (!topic) throw new Error(`No topic found for category ${category.id}`);
      return topic.id;
    });

    await tx.enrollment.createMany({
      data: enrolledTopicIds.map((topicId) => ({ userId, topicId })),
      skipDuplicates: true,
    });

    const updated = await tx.user.updateMany({
      where: { id: userId, onboardingCompletedAt: null },
      data: {
        onboardingCompletedAt: new Date(),
        dailyGoalMinutes: input.dailyGoalMinutes,
        reminderTime: input.reminderTime,
        preferredTimeZone: input.timeZone ?? 'UTC',
      },
    });
    if (updated.count === 0) {
      throw new AppError(409, ERROR_CODES.CONFLICT, 'Onboarding has already been completed');
    }
    const updatedUser = await tx.user.findUniqueOrThrow({ where: { id: userId } });

    return { user: toAuthUser(updatedUser), enrolledTopicIds };
  });
}
