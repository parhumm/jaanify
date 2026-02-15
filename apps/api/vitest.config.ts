import { defineConfig } from 'vitest/config';
import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['test/**/*.test.ts'],
    exclude: [
      'test/**/*.integration.test.ts',
      'test/security/rate-limiter.test.ts',
      'test/security/secure-token-storage.test.ts',
    ],
    environment: 'node',
    globals: true,
    mockReset: true,
    testTimeout: 15_000,
    setupFiles: ['./test/config/setup/unit.ts'],
    pool: 'forks',
    poolOptions: {
      forks: {
        execArgv: ['--experimental-global-webcrypto'],
      },
    },
    alias: {
      '../src/': new URL('./src/', import.meta.url).pathname,
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.schema.ts', 'src/server.ts', 'src/app.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.js', '.mts', '.mjs', '.json'],
  },
});
