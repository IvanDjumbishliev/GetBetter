import { defineConfig } from 'vitest/config';
import { loadTestEnv } from './test/env.ts';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': new URL('../shared/src', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
    env: loadTestEnv(),
    globalSetup: ['./test/globalSetup.ts'],
    setupFiles: ['./test/setup.ts'],
    // Test files share one database, so run them one at a time.
    fileParallelism: false,
  },
});
