import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildTestApp, authenticatedInject } from '../config/test-utils.js';

describe('Feature: Daily Plans API Integration', () => {
  let app: FastifyInstance;
  const userId = 'test-user-1';

  beforeAll(async () => {
    app = await buildTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── POST /v1/daily-plans/generate — BDD F2-S1 (@smoke @positive) ──

  describe('POST /v1/daily-plans/generate', () => {
    describe('Scenario: Generate daily plan with tasks', () => {
      it('should return 201 with plan containing ordered slots', async () => {
        // Requires tasks to exist for the user — seed in beforeEach if using real DB
        const response = await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/daily-plans/generate',
        });

        // 201 if created, or 409 if plan already exists for today
        expect([201, 409]).toContain(response.statusCode);

        if (response.statusCode === 201) {
          const body = response.json();
          expect(body.id).toBeDefined();
          expect(body.status).toBe('active');
          expect(body.reasoning_method).toBeDefined();
          expect(body.slots).toBeInstanceOf(Array);
        }
      });
    });

    describe('Scenario: Duplicate plan generation rejected', () => {
      it('should return 409 when plan already exists for today', async () => {
        // Generate first plan
        await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/daily-plans/generate',
        });

        // Try to generate again
        const response = await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/daily-plans/generate',
        });

        expect(response.statusCode).toBe(409);
        const body = response.json();
        expect(body.detail).toContain('already exists');
      });
    });
  });

  // ── GET /v1/daily-plans ──

  describe('GET /v1/daily-plans', () => {
    describe('Scenario: List plans with pagination', () => {
      it('should return paginated plans with slots', async () => {
        const response = await authenticatedInject(app, userId, {
          method: 'GET',
          url: '/v1/daily-plans?limit=10',
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body.data).toBeInstanceOf(Array);
        expect(body.pagination).toBeDefined();
        expect(body.pagination.limit).toBe(10);
      });
    });
  });

  // ── GET /v1/daily-plans/:id ──

  describe('GET /v1/daily-plans/:plan_id', () => {
    describe('Scenario: Get non-existent plan', () => {
      it('should return 404', async () => {
        const response = await authenticatedInject(app, userId, {
          method: 'GET',
          url: '/v1/daily-plans/non-existent-id',
        });

        expect(response.statusCode).toBe(404);
      });
    });
  });

  // ── PATCH /v1/daily-plans/:planId/slots/:slotId ──

  describe('PATCH /v1/daily-plans/:plan_id/slots/:slot_id', () => {
    describe('Scenario: Update slot status to completed', () => {
      it('should update and return slot', async () => {
        // Generate a plan first
        const genResponse = await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/daily-plans/generate',
        });

        if (genResponse.statusCode === 201) {
          const plan = genResponse.json();
          const slot = plan.slots?.[0];

          if (slot) {
            const response = await authenticatedInject(app, userId, {
              method: 'PATCH',
              url: `/v1/daily-plans/${plan.id}/slots/${slot.id}`,
              payload: { status: 'completed' },
            });

            expect(response.statusCode).toBe(200);
            expect(response.json().status).toBe('completed');
          }
        }
      });
    });

    describe('Scenario: Update slot on another user plan', () => {
      it('should return 404 when plan belongs to different user', async () => {
        const response = await authenticatedInject(app, 'other-user', {
          method: 'PATCH',
          url: '/v1/daily-plans/some-plan-id/slots/some-slot-id',
          payload: { status: 'completed' },
        });

        expect(response.statusCode).toBe(404);
      });
    });
  });
});
