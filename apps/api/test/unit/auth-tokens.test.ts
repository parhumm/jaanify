import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as jose from 'jose';

// Mock env module
vi.mock('../src/lib/env.js', () => ({
  env: {
    JWT_SECRET: 'test-jwt-secret-at-least-32-characters-long',
    REFRESH_TOKEN_SECRET: 'test-refresh-secret-at-least-32-chars',
  },
}));

describe('Feature: JWT Token Management', () => {
  let authTokens: typeof import('../src/lib/auth-tokens.js');

  beforeEach(async () => {
    authTokens = await import('../src/lib/auth-tokens.js');
  });

  // ── Positive: Token Generation ──

  describe('Scenario: Generate access token with valid payload', () => {
    it('should produce a signed HS256 JWT with sub, email, iss, aud claims', async () => {
      const token = await authTokens.generateAccessToken({
        sub: 'user-123',
        email: 'test@example.com',
      });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);

      // Decode and verify structure
      const decoded = jose.decodeJwt(token);
      expect(decoded.sub).toBe('user-123');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.iss).toBe('jaanify');
      expect(decoded.aud).toBe('jaanify-api');
      expect(decoded.jti).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });
  });

  describe('Scenario: Access token expires in 15 minutes', () => {
    it('should set expiration 15 minutes from issuance', async () => {
      const token = await authTokens.generateAccessToken({ sub: 'user-1' });
      const decoded = jose.decodeJwt(token);

      const iat = decoded.iat!;
      const exp = decoded.exp!;
      const diffSeconds = exp - iat;

      expect(diffSeconds).toBe(900); // 15 minutes = 900 seconds
    });
  });

  describe('Scenario: Refresh token carries only sub claim', () => {
    it('should not include email or role in refresh token payload', async () => {
      const token = await authTokens.generateRefreshToken({
        sub: 'user-456',
        email: 'test@example.com',
        role: 'admin',
      });

      const decoded = jose.decodeJwt(token);
      expect(decoded.sub).toBe('user-456');
      expect(decoded.email).toBeUndefined();
      expect(decoded.role).toBeUndefined();
    });
  });

  describe('Scenario: Refresh token expires in 7 days', () => {
    it('should set expiration 7 days from issuance', async () => {
      const token = await authTokens.generateRefreshToken({ sub: 'user-1' });
      const decoded = jose.decodeJwt(token);

      const iat = decoded.iat!;
      const exp = decoded.exp!;
      const diffSeconds = exp - iat;

      expect(diffSeconds).toBe(604800); // 7 days = 604800 seconds
    });
  });

  describe('Scenario: Generate token pair returns both tokens', () => {
    it('should return access_token, refresh_token, token_type, and expires_in', async () => {
      const pair = await authTokens.generateTokenPair({
        sub: 'user-789',
        email: 'test@example.com',
      });

      expect(pair.access_token).toBeDefined();
      expect(pair.refresh_token).toBeDefined();
      expect(pair.token_type).toBe('Bearer');
      expect(pair.expires_in).toBe(900);
      expect(pair.access_token).not.toBe(pair.refresh_token);
    });
  });

  // ── Positive: Token Verification ──

  describe('Scenario: Verify valid access token', () => {
    it('should return payload with sub claim', async () => {
      const token = await authTokens.generateAccessToken({ sub: 'user-1' });
      const payload = await authTokens.verifyAccessToken(token);

      expect(payload.sub).toBe('user-1');
      expect(payload.iss).toBe('jaanify');
      expect(payload.aud).toBe('jaanify-api');
    });
  });

  describe('Scenario: Verify valid refresh token', () => {
    it('should return payload with sub claim', async () => {
      const token = await authTokens.generateRefreshToken({ sub: 'user-1' });
      const payload = await authTokens.verifyRefreshToken(token);

      expect(payload.sub).toBe('user-1');
    });
  });

  // ── Negative: Token Verification Failures ──

  describe('Scenario: Reject expired access token', () => {
    it('should throw JWTExpired for an expired token', async () => {
      // Create a token that already expired
      const secret = new TextEncoder().encode('test-jwt-secret-at-least-32-characters-long');
      const expiredToken = await new jose.SignJWT({ email: 'test@example.com' })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject('user-1')
        .setIssuedAt(Math.floor(Date.now() / 1000) - 3600) // 1 hour ago
        .setExpirationTime(Math.floor(Date.now() / 1000) - 1800) // 30 min ago
        .setIssuer('jaanify')
        .setAudience('jaanify-api')
        .sign(secret);

      await expect(authTokens.verifyAccessToken(expiredToken)).rejects.toThrow(
        jose.errors.JWTExpired,
      );
    });
  });

  describe('Scenario: Reject token with wrong secret', () => {
    it('should throw on signature verification failure', async () => {
      const wrongSecret = new TextEncoder().encode('wrong-secret-that-is-32-chars-long!');
      const tampered = await new jose.SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject('user-1')
        .setExpirationTime('15m')
        .setIssuer('jaanify')
        .setAudience('jaanify-api')
        .sign(wrongSecret);

      await expect(authTokens.verifyAccessToken(tampered)).rejects.toThrow();
    });
  });

  describe('Scenario: Reject access token verified with refresh secret', () => {
    it('should not allow cross-verification between token types', async () => {
      const accessToken = await authTokens.generateAccessToken({ sub: 'user-1' });
      await expect(authTokens.verifyRefreshToken(accessToken)).rejects.toThrow();
    });
  });

  // ── Boundary: Unique JTI per token ──

  describe('Scenario: Each token has unique jti', () => {
    it('should generate different jti for consecutive tokens', async () => {
      const token1 = await authTokens.generateAccessToken({ sub: 'user-1' });
      const token2 = await authTokens.generateAccessToken({ sub: 'user-1' });

      const jti1 = jose.decodeJwt(token1).jti;
      const jti2 = jose.decodeJwt(token2).jti;

      expect(jti1).toBeDefined();
      expect(jti2).toBeDefined();
      expect(jti1).not.toBe(jti2);
    });
  });
});
