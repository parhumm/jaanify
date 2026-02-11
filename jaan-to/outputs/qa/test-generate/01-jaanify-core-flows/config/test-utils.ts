import { expect } from 'vitest';
import type { FastifyInstance } from 'fastify';

/**
 * Custom Vitest matchers for Jaanify test suite.
 */
expect.extend({
  /**
   * Assert response matches RFC 9457 Problem Details structure.
   */
  toBeRFC9457Error(received: Record<string, unknown>, expected: { status: number; title?: string }) {
    const pass =
      typeof received.type === 'string' &&
      received.type.startsWith('https://api.jaanify.com/errors/') &&
      received.status === expected.status &&
      typeof received.title === 'string' &&
      (expected.title === undefined || received.title === expected.title);

    return {
      pass,
      message: () =>
        pass
          ? `Expected response NOT to be RFC 9457 with status ${expected.status}`
          : `Expected RFC 9457 error with status ${expected.status}, got: ${JSON.stringify(received)}`,
    };
  },

  /**
   * Assert response matches cursor pagination structure.
   */
  toHaveCursorPagination(received: Record<string, unknown>) {
    const pagination = received.pagination as Record<string, unknown> | undefined;
    const pass =
      pagination !== undefined &&
      typeof pagination.has_more === 'boolean' &&
      typeof pagination.limit === 'number' &&
      (pagination.cursor === null || typeof pagination.cursor === 'string');

    return {
      pass,
      message: () =>
        pass
          ? 'Expected response NOT to have cursor pagination'
          : `Expected cursor pagination structure, got: ${JSON.stringify(received.pagination)}`,
    };
  },
});

/**
 * Build a Fastify app instance for integration testing.
 * Uses `inject()` for HTTP testing without a running server.
 */
export async function buildTestApp(): Promise<FastifyInstance> {
  // Dynamic import to avoid loading app config at module level
  const { buildApp } = await import('../src/app.js');
  const app = await buildApp();
  await app.ready();
  return app;
}

/**
 * Generate a valid JWT access token for integration tests.
 */
export async function generateTestToken(userId: string): Promise<string> {
  const { generateAccessToken } = await import('../src/lib/auth-tokens.js');
  return generateAccessToken({ sub: userId, email: 'test@example.com' });
}

/**
 * Helper to make authenticated requests in integration tests.
 */
export async function authenticatedInject(
  app: FastifyInstance,
  userId: string,
  options: { method: string; url: string; payload?: unknown },
) {
  const token = await generateTestToken(userId);
  return app.inject({
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

// Type augmentation for custom matchers
declare module 'vitest' {
  interface Assertion<T> {
    toBeRFC9457Error(expected: { status: number; title?: string }): T;
    toHaveCursorPagination(): T;
  }
  interface AsymmetricMatchersContaining {
    toBeRFC9457Error(expected: { status: number; title?: string }): void;
    toHaveCursorPagination(): void;
  }
}
