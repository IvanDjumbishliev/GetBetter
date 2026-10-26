import { existsSync } from 'node:fs';
import { defineConfig, env } from 'prisma/config';

if (existsSync('server/.env')) {
  process.loadEnvFile('server/.env');
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
