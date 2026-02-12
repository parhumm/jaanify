import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildTestApp, generateTestToken } from '../config/test-utils.js';
import { server } from '../config/mocks/server.js';
import { errorHandlers } from '../config/mocks/handlers.js';

describe('Feature: Auth API Integration', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── POST /v1/auth/google — BDD F4-S3 (@smoke @positive) ──

  describe('POST /v1/auth/google', () => {
    describe('Scenario: Successful Google OAuth login', () => {
      it('should return 200 with access_token and refresh_token', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/v1/auth/google',
          payload: {
            code: 'valid-google-auth-code',
            redirect_uri: 'http://localhost:3001/auth/callback',
          },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body.access_token).toBeDefined();
        expect(body.refresh_token).toBeDefined();
        expect(body.token_type).toBe('Bearer');
        expect(body.expires_in).toBe(900);
      });
    });

    describe('Scenario: Google OAuth with invalid code', () => {
      it('should return 502 when Google rejects the code', async () => {
        server.use(errorHandlers.googleOAuth);

        const response = await app.inject({
          method: 'POST',
          url: '/v1/auth/google',
          payload: {
            code: 'invalid-code',
            redirect_uri: 'http://localhost:3001/auth/callback',
          },
        });

        expect(response.statusCode).toBe(502);
        const body = response.json();
        expect(body.type).toContain('external-service-error');
      });
    });

    describe('Scenario: Missing required fields', () => {
      it('should return 400 for missing code', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/v1/auth/google',
          payload: { redirect_uri: 'http://localhost:3001/auth/callback' },
        });

        expect(response.statusCode).toBe(400);
      });
    });
  });

  // ── POST /v1/auth/refresh ──

  describe('POST /v1/auth/refresh', () => {
    describe('Scenario: Valid refresh token returns new pair', () => {
      it('should return 200 with fresh token pair', async () => {
        // First, login to get a refresh token
        const loginResponse = await app.inject({
          method: 'POST',
          url: '/v1/auth/google',
          payload: {
            code: 'valid-code',
            redirect_uri: 'http://localhost:3001/auth/callback',
          },
        });

        const { refresh_token } = loginResponse.json();

        const response = await app.inject({
          method: 'POST',
          url: '/v1/auth/refresh',
          payload: { refresh_token },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body.access_token).toBeDefined();
        expect(body.refresh_token).toBeDefined();
      });
    });

    describe('Scenario: Invalid refresh token', () => {
      it('should return 401', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/v1/auth/refresh',
          payload: { refresh_token: 'invalid.token.here' },
        });

        expect(response.statusCode).toBe(401);
      });
    });
  });

  // ── DELETE /v1/auth/logout ──

  describe('DELETE /v1/auth/logout', () => {
    describe('Scenario: Authenticated logout', () => {
      it('should return 204 no content', async () => {
        const token = await generateTestToken('user-1');

        const response = await app.inject({
          method: 'DELETE',
          url: '/v1/auth/logout',
          headers: { authorization: `Bearer ${token}` },
        });

        expect(response.statusCode).toBe(204);
      });
    });
  });

  // ── Auth middleware — protected route without token ──

  describe('Protected routes', () => {
    describe('Scenario: Access protected route without token', () => {
      it('should return 401 on /v1/tasks without Authorization', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/v1/tasks',
        });

        expect(response.statusCode).toBe(401);
        const body = response.json();
        expect(body.type).toBe('https://api.jaanify.com/errors/authentication-required');
      });
    });
  });
});
