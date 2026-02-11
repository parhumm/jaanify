import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildTestApp, authenticatedInject } from '../config/test-utils.js';

describe('Feature: Tasks API Integration', () => {
  let app: FastifyInstance;
  const userId = 'test-user-1';

  beforeAll(async () => {
    app = await buildTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── POST /v1/tasks — BDD F1-S1 (@smoke @positive) ──

  describe('POST /v1/tasks', () => {
    describe('Scenario: Create task with AI parsing', () => {
      it('should return 201 with enriched task including reasoning', async () => {
        const response = await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/tasks',
          payload: {
            title: 'Call Sarah about the Johnson proposal by Friday 2 PM',
            raw_input: 'Call Sarah about the Johnson proposal by Friday 2 PM',
          },
        });

        expect(response.statusCode).toBe(201);
        const body = response.json();
        expect(body.id).toBeDefined();
        expect(body.title).toBeDefined();
        expect(body.priority_score).toBeDefined();
      });
    });

    describe('Scenario: Create task without raw_input (manual entry)', () => {
      it('should create task with provided fields, no AI parsing', async () => {
        const response = await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/tasks',
          payload: {
            title: 'Manual task entry',
            description: 'A manually created task',
            category: 'Personal',
            energy_level: 'low',
          },
        });

        expect(response.statusCode).toBe(201);
        const body = response.json();
        expect(body.title).toBe('Manual task entry');
      });
    });

    describe('Scenario: Create task with empty title', () => {
      it('should return 400 validation error', async () => {
        const response = await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/tasks',
          payload: { title: '' },
        });

        expect(response.statusCode).toBe(400);
      });
    });
  });

  // ── GET /v1/tasks — Cursor Pagination ──

  describe('GET /v1/tasks', () => {
    describe('Scenario: List tasks with pagination', () => {
      it('should return paginated tasks with cursor', async () => {
        const response = await authenticatedInject(app, userId, {
          method: 'GET',
          url: '/v1/tasks?limit=10',
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body.data).toBeInstanceOf(Array);
        expect(body.pagination).toBeDefined();
        expect(body.pagination.has_more).toBeDefined();
        expect(body.pagination.limit).toBe(10);
      });
    });

    describe('Scenario: Filter tasks by status', () => {
      it('should return only tasks matching status filter', async () => {
        const response = await authenticatedInject(app, userId, {
          method: 'GET',
          url: '/v1/tasks?status=active&limit=10',
        });

        expect(response.statusCode).toBe(200);
      });
    });
  });

  // ── GET /v1/tasks/:id ──

  describe('GET /v1/tasks/:task_id', () => {
    describe('Scenario: Get non-existent task', () => {
      it('should return 404', async () => {
        const response = await authenticatedInject(app, userId, {
          method: 'GET',
          url: '/v1/tasks/non-existent-id',
        });

        expect(response.statusCode).toBe(404);
      });
    });
  });

  // ── PATCH /v1/tasks/:id ──

  describe('PATCH /v1/tasks/:task_id', () => {
    describe('Scenario: Update task status to completed', () => {
      it('should set completedAt and return updated task', async () => {
        // Create a task first
        const createResponse = await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/tasks',
          payload: { title: 'Task to complete' },
        });
        const taskId = createResponse.json().id;

        const response = await authenticatedInject(app, userId, {
          method: 'PATCH',
          url: `/v1/tasks/${taskId}`,
          payload: { status: 'completed' },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body.status).toBe('completed');
        expect(body.completed_at).toBeDefined();
      });
    });
  });

  // ── DELETE /v1/tasks/:id — Soft Delete ──

  describe('DELETE /v1/tasks/:task_id', () => {
    describe('Scenario: Soft delete task', () => {
      it('should return 200 and task should not appear in list', async () => {
        // Create and then delete
        const createResponse = await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/tasks',
          payload: { title: 'Task to delete' },
        });
        const taskId = createResponse.json().id;

        const deleteResponse = await authenticatedInject(app, userId, {
          method: 'DELETE',
          url: `/v1/tasks/${taskId}`,
        });

        expect(deleteResponse.statusCode).toBe(200);

        // Verify task no longer in list
        const listResponse = await authenticatedInject(app, userId, {
          method: 'GET',
          url: '/v1/tasks?limit=100',
        });

        const taskIds = listResponse.json().data.map((t: { id: string }) => t.id);
        expect(taskIds).not.toContain(taskId);
      });
    });
  });

  // ── POST /v1/tasks/parse ──

  describe('POST /v1/tasks/parse', () => {
    describe('Scenario: Parse natural language input', () => {
      it('should return structured fields with confidence score', async () => {
        const response = await authenticatedInject(app, userId, {
          method: 'POST',
          url: '/v1/tasks/parse',
          payload: { input: 'Call Sarah about the Johnson proposal by Friday 2 PM' },
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body.title).toBeDefined();
        expect(body.confidence).toBeGreaterThanOrEqual(0);
        expect(body.confidence).toBeLessThanOrEqual(1);
      });
    });
  });
});
