import { afterAll, beforeEach } from 'vitest';
import { prisma } from '../src/lib/prisma';

if (!new URL(process.env.DATABASE_URL!).pathname.endsWith('_test')) {
  throw new Error('Refusing to run tests against a database whose name does not end in "_test".');
}

beforeEach(async () => {
  // Cascades to every table that references users (refresh tokens, enrollments, ...).
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');
});

afterAll(async () => {
  await prisma.$disconnect();
});
