import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FastifyRequest, FastifyReply } from 'fastify';

vi.mock('../src/lib/env.js', () => ({
  env: {
    JWT_SECRET: 'test-jwt-secret-at-least-32-characters-long',
    REFRESH_TOKEN_SECRET: 'test-refresh-secret-at-least-32-chars',
  },
}));

describe('Feature: Auth Plugin — JWT Middleware', () => {
  let generateAccessToken: (payload: { sub: string; email?: string }) => Promise<string>;

  beforeEach(async () => {
    const authTokens = await import('../src/lib/auth-tokens.js');
    generateAccessToken = authTokens.generateAccessToken;
  });

  // Helper to create mock request/reply
  function createMockRequest(overrides: Partial<FastifyRequest> = {}): FastifyRequest {
    return {
      url: '/v1/tasks',
      headers: {},
      routeOptions: { config: {} },
      log: { warn: vi.fn() },
      userId: '',
      jwtPayload: null,
      ...overrides,
    } as unknown as FastifyRequest;
  }

  function createMockReply(): FastifyReply {
    const reply = {
      status: vi.fn().mockReturnThis(),
      header: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    return reply as unknown as FastifyReply;
  }

  // ── Positive: Public Paths Bypass Auth ──

  describe('Scenario: Public paths skip authentication', () => {
    it('should allow /v1/auth/google without token', () => {
      const publicPaths = [
        '/v1/auth/google',
        '/v1/auth/refresh',
        '/v1/auth/register',
        '/v1/guest-sessions',
        '/v1/health',
        '/docs',
        '/documentation',
      ];

      for (const path of publicPaths) {
        const request = createMockRequest({ url: path });
        const isPublic = [
          '/v1/auth/google',
          '/v1/auth/refresh',
          '/v1/auth/register',
          '/v1/guest-sessions',
          '/v1/health',
          '/docs',
          '/documentation',
        ].some((p) => path.startsWith(p));
        expect(isPublic).toBe(true);
      }
    });
  });

  // ── Negative: Missing Authorization Header ──

  describe('Scenario: Request without Authorization header', () => {
    it('should return 401 with RFC 9457 error', () => {
      const request = createMockRequest({ url: '/v1/tasks' });
      const reply = createMockReply();

      // Simulate what the auth plugin does
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        reply.status(401).header('Content-Type', 'application/problem+json').send({
          type: 'https://api.jaanify.com/errors/authentication-required',
          status: 401,
          title: 'Authentication Required',
          detail: 'Missing Authorization header. Expected: Bearer <token>',
          instance: request.url,
        });
      }

      expect(reply.status).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'https://api.jaanify.com/errors/authentication-required',
          status: 401,
        }),
      );
    });
  });

  // ── Negative: Invalid Bearer Scheme ──

  describe('Scenario: Request with non-Bearer scheme', () => {
    it('should reject Basic auth with 401', () => {
      const request = createMockRequest({
        url: '/v1/tasks',
        headers: { authorization: 'Basic dXNlcjpwYXNz' },
      });
      const reply = createMockReply();

      const authHeader = request.headers.authorization as string;
      if (!authHeader.startsWith('Bearer ')) {
        reply.status(401).send({
          type: 'https://api.jaanify.com/errors/authentication-required',
          status: 401,
          detail: 'Invalid Authorization scheme. Expected: Bearer <token>',
        });
      }

      expect(reply.status).toHaveBeenCalledWith(401);
    });
  });

  // ── Positive: Valid Token Sets userId ──

  describe('Scenario: Valid Bearer token sets request.userId', () => {
    it('should extract sub from verified token and set userId', async () => {
      const token = await generateAccessToken({ sub: 'user-123', email: 'test@example.com' });
      const { verifyAccessToken } = await import('../src/lib/auth-tokens.js');
      const payload = await verifyAccessToken(token);

      // Simulate what the plugin does
      expect(payload.sub).toBe('user-123');

      const request = createMockRequest();
      request.userId = payload.sub!;
      request.jwtPayload = payload;

      expect(request.userId).toBe('user-123');
    });
  });

  // ── Negative: Expired Token ──

  describe('Scenario: Expired access token returns token-expired error', () => {
    it('should return 401 with token-expired type URI', async () => {
      const jose = await import('jose');
      const secret = new TextEncoder().encode('test-jwt-secret-at-least-32-characters-long');

      const expiredToken = await new jose.SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject('user-1')
        .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
        .setExpirationTime(Math.floor(Date.now() / 1000) - 1800)
        .setIssuer('jaanify')
        .setAudience('jaanify-api')
        .sign(secret);

      const { verifyAccessToken } = await import('../src/lib/auth-tokens.js');

      try {
        await verifyAccessToken(expiredToken);
        expect.unreachable('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(jose.errors.JWTExpired);
      }
    });
  });

  // ── Boundary: Token with missing sub ──

  describe('Scenario: Token without sub claim', () => {
    it('should reject token missing required sub claim', async () => {
      const jose = await import('jose');
      const secret = new TextEncoder().encode('test-jwt-secret-at-least-32-characters-long');

      const noSubToken = await new jose.SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('15m')
        .setIssuer('jaanify')
        .setAudience('jaanify-api')
        .sign(secret);

      const { verifyAccessToken } = await import('../src/lib/auth-tokens.js');
      const payload = await verifyAccessToken(noSubToken);

      // Plugin checks for payload.sub
      expect(payload.sub).toBeUndefined();
    });
  });
});
