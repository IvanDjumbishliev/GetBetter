import { Difficulty, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LESSONS_PER_TOPIC = 3;
const FLASHCARDS_PER_LESSON = 2;
const QUESTIONS_PER_LESSON = 3;

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

function placeholderContent(topic: string, order: number): string {
  return [
    `# ${topic}: Part ${order}`,
    '',
    `This is placeholder content for part ${order} of "${topic}".`,
    '',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    '',
    '## Key ideas',
    '',
    '- Placeholder key idea one',
    '- Placeholder key idea two',
    '- Placeholder key idea three',
  ].join('\n');
}

function placeholderQuestion(topic: string, order: number, n: number) {
  const options = ['a', 'b', 'c', 'd'].map((id) => ({
    id,
    text: `Placeholder option ${id.toUpperCase()}`,
  }));
  return {
    question: `Placeholder question ${n} about ${topic} (part ${order})?`,
    options,
    correctOptionId: options[(n - 1) % options.length]!.id,
    explanation: `Placeholder explanation for question ${n}.`,
  };
}

async function main() {
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
      const topicData = {
        title: topicSeed.title,
        description: `A placeholder introduction to ${topicSeed.title}.`,
        difficulty: topicSeed.difficulty,
        estimatedMinutes: topicSeed.estimatedMinutes,
        categoryId: category.id,
      };
      const topic = await prisma.topic.upsert({
        where: { slug: topicSlug },
        update: topicData,
        create: { ...topicData, slug: topicSlug },
      });

      for (let order = 1; order <= LESSONS_PER_TOPIC; order++) {
        const lessonData = {
          title: `${topicSeed.title}: Part ${order}`,
          content: placeholderContent(topicSeed.title, order),
          summary: `Placeholder summary for part ${order} of ${topicSeed.title}.`,
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
            data: Array.from({ length: FLASHCARDS_PER_LESSON }, (_, i) => ({
              lessonId: lesson.id,
              front: `Placeholder term ${i + 1} from ${lessonData.title}`,
              back: `Placeholder definition ${i + 1}.`,
            })),
          }),
          prisma.quizQuestion.createMany({
            data: Array.from({ length: QUESTIONS_PER_LESSON }, (_, i) => ({
              lessonId: lesson.id,
              ...placeholderQuestion(topicSeed.title, order, i + 1),
            })),
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
