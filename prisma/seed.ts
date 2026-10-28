import { Difficulty } from '@prisma/client';
import { prisma } from '../server/src/lib/prisma';
import { seedContent } from './seed-content';

interface TopicSeed {
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
}

interface CategorySeed {
  name: string;
  description: string;
  topics: [TopicSeed, TopicSeed, TopicSeed];
}

const categories: CategorySeed[] = [
  {
    name: 'Science',
    description: 'Understand how the natural world works.',
    topics: [
      { title: 'Basics of Physics', difficulty: Difficulty.BEGINNER, estimatedMinutes: 30 },
      {
        title: 'Introduction to Genetics',
        difficulty: Difficulty.INTERMEDIATE,
        estimatedMinutes: 40,
      },
      { title: 'Quantum Computing', difficulty: Difficulty.ADVANCED, estimatedMinutes: 60 },
    ],
  },
  {
    name: 'Technology',
    description: 'Learn the ideas behind modern software and hardware.',
    topics: [
      { title: 'How the Internet Works', difficulty: Difficulty.BEGINNER, estimatedMinutes: 25 },
      {
        title: 'Machine Learning Fundamentals',
        difficulty: Difficulty.INTERMEDIATE,
        estimatedMinutes: 45,
      },
      { title: 'Distributed Systems', difficulty: Difficulty.ADVANCED, estimatedMinutes: 60 },
    ],
  },
  {
    name: 'Finance',
    description: 'Make smarter decisions about money and markets.',
    topics: [
      { title: 'Personal Budgeting', difficulty: Difficulty.BEGINNER, estimatedMinutes: 20 },
      {
        title: 'Investing in Index Funds',
        difficulty: Difficulty.INTERMEDIATE,
        estimatedMinutes: 35,
      },
      { title: 'Corporate Valuation', difficulty: Difficulty.ADVANCED, estimatedMinutes: 55 },
    ],
  },
  {
    name: 'History',
    description: 'Explore the events and people that shaped the world.',
    topics: [
      { title: 'Ancient Rome', difficulty: Difficulty.BEGINNER, estimatedMinutes: 30 },
      {
        title: 'The Industrial Revolution',
        difficulty: Difficulty.INTERMEDIATE,
        estimatedMinutes: 35,
      },
      { title: 'The Cold War', difficulty: Difficulty.ADVANCED, estimatedMinutes: 50 },
    ],
  },
  {
    name: 'Design',
    description: 'Learn the principles behind great visual and product design.',
    topics: [
      { title: 'Color Theory', difficulty: Difficulty.BEGINNER, estimatedMinutes: 20 },
      { title: 'Typography Essentials', difficulty: Difficulty.INTERMEDIATE, estimatedMinutes: 30 },
      { title: 'Design Systems', difficulty: Difficulty.ADVANCED, estimatedMinutes: 45 },
    ],
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const existingTopicCount = await prisma.topic.count();
  const placeholderLessonCount = await prisma.lesson.count({
    where: { content: { contains: 'This is placeholder content for part' } },
  });
  if (
    process.env.SEED_IF_EMPTY === 'true' &&
    existingTopicCount > 0 &&
    placeholderLessonCount === 0
  ) {
    console.log('Seed skipped: topics already exist.');
    return;
  }

  for (const categorySeed of categories) {
    const categorySlug = slugify(categorySeed.name);
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: categorySeed.name, description: categorySeed.description },
      create: {
        name: categorySeed.name,
        slug: categorySlug,
        description: categorySeed.description,
      },
    });

    for (const topicSeed of categorySeed.topics) {
      const topicSlug = slugify(topicSeed.title);
      const contentSeed = seedContent[topicSlug];
      if (!contentSeed) throw new Error(`Missing lesson content for topic "${topicSeed.title}".`);
      const topicData = {
        title: topicSeed.title,
        description: contentSeed.description,
        difficulty: topicSeed.difficulty,
        estimatedMinutes: topicSeed.estimatedMinutes,
        categoryId: category.id,
      };
      const topic = await prisma.topic.upsert({
        where: { slug: topicSlug },
        update: topicData,
        create: { ...topicData, slug: topicSlug },
      });

      for (const [index, lessonSeed] of contentSeed.lessons.entries()) {
        const order = index + 1;
        const lessonData = {
          title: lessonSeed.title,
          content: lessonSeed.content,
          summary: lessonSeed.summary,
        };
        const lesson = await prisma.lesson.upsert({
          where: { topicId_order: { topicId: topic.id, order } },
          update: lessonData,
          create: { ...lessonData, topicId: topic.id, order },
        });

        // Flashcards and questions have no natural key, so replace them wholesale.
        await prisma.$transaction([
          prisma.flashcard.deleteMany({ where: { lessonId: lesson.id } }),
          prisma.quizQuestion.deleteMany({ where: { lessonId: lesson.id } }),
          prisma.flashcard.createMany({
            data: lessonSeed.flashcards.map(([front, back]) => ({
              lessonId: lesson.id,
              front,
              back,
            })),
          }),
          prisma.quizQuestion.createMany({
            data: lessonSeed.questions.map(
              ([question, choices, correctIndex, explanation], questionIndex) => {
                const offset = (order + questionIndex) % choices.length;
                const orderedChoices = [...choices.slice(offset), ...choices.slice(0, offset)];
                const orderedCorrectIndex =
                  (correctIndex - offset + choices.length) % choices.length;

                return {
                  lessonId: lesson.id,
                  question,
                  options: orderedChoices.map((text, optionIndex) => ({
                    id: String.fromCharCode(97 + optionIndex),
                    text,
                  })),
                  correctOptionId: String.fromCharCode(97 + orderedCorrectIndex),
                  explanation,
                };
              },
            ),
          }),
        ]);
      }
    }
  }

  const [categoryCount, topicCount, lessonCount, flashcardCount, questionCount] = await Promise.all(
    [
      prisma.category.count(),
      prisma.topic.count(),
      prisma.lesson.count(),
      prisma.flashcard.count(),
      prisma.quizQuestion.count(),
    ],
  );
  console.log(
    `Seeded: ${categoryCount} categories, ${topicCount} topics, ${lessonCount} lessons, ` +
      `${flashcardCount} flashcards, ${questionCount} quiz questions.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
