import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Feature: Environment Validation', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  // ── Positive: All required vars present ──

  describe('Scenario: Valid environment with all required vars', () => {
    it('should parse and return validated env object', async () => {
      vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/jaanify');
      vi.stubEnv('JWT_SECRET', 'a-very-long-jwt-secret-for-testing-purposes');
      vi.stubEnv('REFRESH_TOKEN_SECRET', 'a-very-long-refresh-secret-for-testing');
      vi.stubEnv('GOOGLE_CLIENT_ID', 'mock-google-client-id');
      vi.stubEnv('GOOGLE_CLIENT_SECRET', 'mock-google-client-secret');
      vi.stubEnv('OPENAI_API_KEY', 'sk-test-mock-key');

      // validateEnv reads from process.env via Zod
      const { validateEnv } = await import('../src/lib/env.js');

      // Should not throw
      expect(() => validateEnv()).not.toThrow();
    });
  });

  // ── Negative: Missing required DATABASE_URL ──

  describe('Scenario: Missing DATABASE_URL', () => {
    it('should throw Zod validation error', async () => {
      vi.stubEnv('DATABASE_URL', '');

      const { validateEnv } = await import('../src/lib/env.js');

      expect(() => validateEnv()).toThrow();
    });
  });

  // ── Boundary: JWT_SECRET minimum length ──

  describe('Scenario: JWT_SECRET below 32 characters', () => {
    it('should reject short secrets', async () => {
      vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/jaanify');
      vi.stubEnv('JWT_SECRET', 'short'); // < 32 chars
      vi.stubEnv('REFRESH_TOKEN_SECRET', 'a-very-long-refresh-secret-for-testing');
      vi.stubEnv('GOOGLE_CLIENT_ID', 'mock-id');
      vi.stubEnv('GOOGLE_CLIENT_SECRET', 'mock-secret');

      const { validateEnv } = await import('../src/lib/env.js');

      expect(() => validateEnv()).toThrow();
    });
  });

  // ── Positive: Default values applied ──

  describe('Scenario: Default PORT and HOST applied', () => {
    it('should use defaults when PORT and HOST not set', async () => {
      vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/jaanify');
      vi.stubEnv('JWT_SECRET', 'a-very-long-jwt-secret-for-testing-purposes');
      vi.stubEnv('REFRESH_TOKEN_SECRET', 'a-very-long-refresh-secret-for-testing');
      vi.stubEnv('GOOGLE_CLIENT_ID', 'mock-id');
      vi.stubEnv('GOOGLE_CLIENT_SECRET', 'mock-secret');
      vi.stubEnv('OPENAI_API_KEY', 'sk-test');

      const { validateEnv } = await import('../src/lib/env.js');
      const env = validateEnv();

      // Default values from env.ts Zod schema
      expect(env.PORT).toBeDefined();
      expect(env.HOST).toBeDefined();
    });
  });
});
