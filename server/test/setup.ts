import { afterAll, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma';

if (!new URL(process.env.DATABASE_URL!).pathname.endsWith('_test')) {
  throw new Error('Refusing to run tests against a database whose name does not end in "_test".');
}

beforeEach(async () => {
  // Cascades to everything that references users or content (tokens, topics, lessons, progress, ...).
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User", "Category" CASCADE');
});

afterAll(async () => {
  await prisma.$disconnect();
});
