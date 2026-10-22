import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const envFile = fileURLToPath(new URL('../.env', import.meta.url));

function withTestDatabaseName(url: string): string {
  const parsed = new URL(url);
  const name = parsed.pathname.replace(/^\//, '');
  parsed.pathname = `/${name.endsWith('_test') ? name : `${name}_test`}`;
  return parsed.toString();
}

/**
 * Environment for the test run. The database defaults to `<DATABASE_URL db name>_test`
 * (override with TEST_DATABASE_URL); JWT secrets are fixed so tests don't depend on .env.
 */
export function loadTestEnv(): Record<string, string> {
  const fileEnv = existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : {};
  const merged: Record<string, string | undefined> = { ...fileEnv, ...process.env };

  const databaseUrl =
    merged.TEST_DATABASE_URL ||
    (merged.DATABASE_URL ? withTestDatabaseName(merged.DATABASE_URL) : undefined);
  if (!databaseUrl) {
    throw new Error('Set TEST_DATABASE_URL or DATABASE_URL (in server/.env) to run tests.');
  }

  return {
    NODE_ENV: 'test',
    DATABASE_URL: databaseUrl,
    ACCESS_TOKEN_SECRET: 'test-access-token-secret-at-least-32-chars',
    REFRESH_TOKEN_SECRET: 'test-refresh-token-secret-at-least-32-chars',
    ACCESS_TOKEN_EXPIRES_IN: '15m',
    REFRESH_TOKEN_EXPIRES_IN: '7d',
  };
}
