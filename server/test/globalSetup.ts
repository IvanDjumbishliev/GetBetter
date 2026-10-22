import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadTestEnv } from './env';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

export default function setup() {
  const { DATABASE_URL } = loadTestEnv();
  // Creates the test database if needed and applies all migrations.
  execSync('npx prisma migrate deploy', {
    cwd: repoRoot,
    env: { ...process.env, DATABASE_URL },
    stdio: 'pipe',
  });
}
