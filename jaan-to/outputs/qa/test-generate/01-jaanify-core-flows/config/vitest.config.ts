import { defineConfig, defineWorkspace } from 'vitest/config';
import path from 'node:path';

export default defineWorkspace([
  // Unit tests — fast, isolated, MSW for external calls
  {
    test: {
      name: 'unit',
      include: ['test/unit/**/*.test.ts'],
      environment: 'node',
      setupFiles: ['test/setup/unit.ts'],
      globals: true,
      mockReset: true,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.schema.ts', 'src/server.ts', 'src/app.ts'],
        thresholds: {
          lines: 80,
          branches: 70,
          functions: 75,
          statements: 80,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },

  // Integration tests — Fastify inject + Prisma + MSW
  {
    test: {
      name: 'integration',
      include: ['test/integration/**/*.integration.test.ts'],
      environment: 'node',
      setupFiles: ['test/setup/integration.ts'],
      globals: true,
      pool: 'forks',
      poolOptions: {
        forks: { singleFork: true },
      },
      testTimeout: 15_000,
      coverage: {
        provider: 'v8',
        include: ['src/routes/**/*.ts'],
        thresholds: {
          lines: 60,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
]);
