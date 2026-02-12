import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { server } from '../config/mocks/server.js';
import { errorHandlers } from '../config/mocks/handlers.js';
import { http, HttpResponse } from 'msw';

// Mock Prisma client
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  guestSession: {
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
  task: {
    createMany: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock('../src/lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

vi.mock('../src/lib/env.js', () => ({
  validateEnv: () => ({
    GOOGLE_CLIENT_ID: 'mock-client-id',
    GOOGLE_CLIENT_SECRET: 'mock-client-secret',
    CORS_ORIGIN: 'http://localhost:3001',
    JWT_SECRET: 'test-jwt-secret-at-least-32-characters-long',
    REFRESH_TOKEN_SECRET: 'test-refresh-secret-at-least-32-chars',
  }),
  env: {
    JWT_SECRET: 'test-jwt-secret-at-least-32-characters-long',
    REFRESH_TOKEN_SECRET: 'test-refresh-secret-at-least-32-chars',
  },
}));

describe('Feature: Authentication Service', () => {
  let authService: typeof import('../src/routes/auth/auth.service.js');

  beforeEach(async () => {
    vi.clearAllMocks();
    authService = await import('../src/routes/auth/auth.service.js');
  });

  // ── F4-S3: Account creation via Google OAuth (BDD: @smoke @positive) ──

  describe('Scenario: Google OAuth login — new user', () => {
    it('should exchange code, create user, and return token pair', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null); // no existing user
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-new',
        email: 'test@example.com',
        name: 'Test User',
      });

      const result = await authService.googleAuth({
        code: 'valid-google-code',
        redirect_uri: 'http://localhost:3001/auth/callback',
      });

      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(result.token_type).toBe('Bearer');
      expect(result.expires_in).toBe(900);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'test@example.com',
          name: 'Test User',
          authProvider: 'google',
        }),
      });
    });
  });

  describe('Scenario: Google OAuth login — existing user', () => {
    it('should update existing user profile and return token pair', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-existing',
        email: 'test@example.com',
      });
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-existing',
        email: 'test@example.com',
        name: 'Test User',
      });

      const result = await authService.googleAuth({
        code: 'valid-google-code',
        redirect_uri: 'http://localhost:3001/auth/callback',
      });

      expect(result.access_token).toBeDefined();
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-existing' },
        data: expect.objectContaining({
          name: 'Test User',
          authProvider: 'google',
          deletedAt: null, // re-activates soft-deleted
        }),
      });
    });
  });

  // ── F1-S6: AI parsing fails with API error (BDD: @negative) ──

  describe('Scenario: Google OAuth fails — token exchange error', () => {
    it('should throw BusinessError when Google returns error', async () => {
      server.use(errorHandlers.googleOAuth);

      await expect(
        authService.googleAuth({
          code: 'invalid-code',
          redirect_uri: 'http://localhost:3001/auth/callback',
        }),
      ).rejects.toThrow('Google token exchange failed');
    });
  });

  // ── Refresh Token ──

  describe('Scenario: Refresh token — valid token', () => {
    it('should verify token and issue new pair', async () => {
      // Generate a real refresh token to test with
      const { generateRefreshToken } = await import('../src/lib/auth-tokens.js');
      const validRefresh = await generateRefreshToken({ sub: 'user-1' });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        deletedAt: null,
      });

      const result = await authService.refreshToken(validRefresh);

      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });
  });

  describe('Scenario: Refresh token — expired token', () => {
    it('should throw unauthorized for expired refresh token', async () => {
      await expect(authService.refreshToken('expired.fake.token')).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });
  });

  describe('Scenario: Refresh token — soft-deleted user', () => {
    it('should throw unauthorized for deactivated account', async () => {
      const { generateRefreshToken } = await import('../src/lib/auth-tokens.js');
      const validRefresh = await generateRefreshToken({ sub: 'user-deleted' });

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-deleted',
        email: 'deleted@example.com',
        deletedAt: new Date(),
      });

      await expect(authService.refreshToken(validRefresh)).rejects.toThrow(
        'Account has been deactivated',
      );
    });
  });

  // ── Register (Guest → User) ──

  describe('Scenario: Register — unsupported provider', () => {
    it('should throw validation error for non-google provider', async () => {
      await expect(
        authService.register({
          anonymous_id: 'anon-1',
          provider: 'github' as 'google',
          code: 'some-code',
        }),
      ).rejects.toThrow('Unsupported auth provider');
    });
  });

  // ── Logout ──

  describe('Scenario: Logout — stateless no-op', () => {
    it('should complete without error', async () => {
      await expect(authService.logout('user-1')).resolves.toBeUndefined();
    });
  });
});
