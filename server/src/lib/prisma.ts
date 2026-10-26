import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL must be configured before creating the Prisma client.');
}

const adapter = new PrismaPg({
  connectionString,
  connectionTimeoutMillis: 5_000,
});

export const prisma = new PrismaClient({ adapter });
