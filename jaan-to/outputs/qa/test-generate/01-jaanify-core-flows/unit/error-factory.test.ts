import { describe, it, expect } from 'vitest';
import { BusinessError } from '../src/lib/error-factory.js';

describe('Feature: RFC 9457 Error Factory', () => {
  // ── Positive: Standard Error Types ──

  describe('Scenario: Create not-found error', () => {
    it('should produce RFC 9457 ProblemDetails with status 404', () => {
      const error = new BusinessError('not-found', 'Task with ID abc not found');

      expect(error.type).toBe('https://api.jaanify.com/errors/not-found');
      expect(error.status).toBe(404);
      expect(error.title).toBe('Not Found');
      expect(error.detail).toBe('Task with ID abc not found');
    });
  });

  describe('Scenario: Create unauthorized error', () => {
    it('should produce RFC 9457 ProblemDetails with status 401', () => {
      const error = new BusinessError('unauthorized', 'Invalid or expired refresh token');

      expect(error.type).toBe('https://api.jaanify.com/errors/unauthorized');
      expect(error.status).toBe(401);
      expect(error.title).toBe('Unauthorized');
      expect(error.detail).toBe('Invalid or expired refresh token');
    });
  });

  describe('Scenario: Create validation-error', () => {
    it('should produce RFC 9457 ProblemDetails with status 400', () => {
      const error = new BusinessError('validation-error', 'Email is required');

      expect(error.type).toContain('validation');
      expect(error.status).toBe(400);
    });
  });

  describe('Scenario: Create unique-constraint-violation', () => {
    it('should produce RFC 9457 ProblemDetails with status 409', () => {
      const error = new BusinessError(
        'unique-constraint-violation',
        'A daily plan already exists for today',
      );

      expect(error.status).toBe(409);
      expect(error.detail).toBe('A daily plan already exists for today');
    });
  });

  describe('Scenario: Create external-service-error', () => {
    it('should produce RFC 9457 ProblemDetails with status 502', () => {
      const error = new BusinessError(
        'external-service-error',
        'Google token exchange failed (400): invalid_grant',
      );

      expect(error.status).toBe(502);
      expect(error.detail).toContain('Google token exchange failed');
    });
  });

  // ── Boundary: Error is an instance of Error ──

  describe('Scenario: BusinessError extends Error', () => {
    it('should be catchable as a standard Error', () => {
      const error = new BusinessError('not-found', 'test');

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBeDefined();
    });
  });

  // ── Boundary: Error type URI format ──

  describe('Scenario: All error types produce valid URI', () => {
    it('should always produce a type starting with https://api.jaanify.com/errors/', () => {
      const errorTypes = [
        'not-found',
        'unauthorized',
        'validation-error',
        'unique-constraint-violation',
        'external-service-error',
      ] as const;

      for (const errorType of errorTypes) {
        const error = new BusinessError(errorType, 'test');
        expect(error.type).toMatch(/^https:\/\/api\.jaanify\.com\/errors\//);
      }
    });
  });
});
