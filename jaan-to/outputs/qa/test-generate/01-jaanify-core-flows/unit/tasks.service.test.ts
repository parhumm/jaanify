import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '../config/mocks/server.js';
import { http, HttpResponse } from 'msw';
import { taskFactory, taskWithDeadlineFactory } from '../fixtures/factories/task.factory.js';

// Mock Prisma
const mockPrisma = {
  task: {
    findMany: vi.fn(),
    findFirstOrThrow: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock('../src/lib/prisma.js', () => ({ prisma: mockPrisma }));
vi.mock('../src/lib/env.js', () => ({
  validateEnv: () => ({
    OPENAI_API_KEY: 'test-openai-key',
    JWT_SECRET: 'test-jwt-secret-at-least-32-characters-long',
    REFRESH_TOKEN_SECRET: 'test-refresh-secret-at-least-32-chars',
  }),
  env: {
    JWT_SECRET: 'test-jwt-secret-at-least-32-characters-long',
    REFRESH_TOKEN_SECRET: 'test-refresh-secret-at-least-32-chars',
  },
}));

describe('Feature: Task Service — CRUD & AI Parsing', () => {
  let tasksService: typeof import('../src/routes/tasks/tasks.service.js');

  beforeEach(async () => {
    vi.clearAllMocks();
    tasksService = await import('../src/routes/tasks/tasks.service.js');
  });

  // ── F1-S1: Create task with AI parsing (BDD: @smoke @positive) ──

  describe('Scenario: Create task with deadline, category, and priority extracted', () => {
    it('should parse raw_input via AI and create enriched task', async () => {
      // MSW returns parsed fields (default handler)
      const createdTask = taskWithDeadlineFactory.build();
      mockPrisma.task.create.mockResolvedValue(createdTask);

      const result = await tasksService.createTask('user-1', {
        title: 'Call Sarah about the Johnson proposal by Friday 2 PM',
        raw_input: 'Call Sarah about the Johnson proposal by Friday 2 PM',
      });

      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          rawInput: 'Call Sarah about the Johnson proposal by Friday 2 PM',
          reasoningJson: expect.objectContaining({ confidence: expect.any(Number) }),
        }),
      });
      expect(result).toBeDefined();
    });
  });

  // ── F1-S6: AI parsing fails (BDD: @negative) ──

  describe('Scenario: AI parsing fails with API error', () => {
    it('should create task with fallback title when OpenAI returns 503', async () => {
      server.use(
        http.post('https://api.openai.com/v1/chat/completions', () =>
          HttpResponse.json({ error: 'service unavailable' }, { status: 503 }),
        ),
      );

      const fallbackTask = taskFactory.build({ title: 'Buy groceries for dinner tonight' });
      mockPrisma.task.create.mockResolvedValue(fallbackTask);

      const result = await tasksService.createTask('user-1', {
        title: 'Buy groceries for dinner tonight',
        raw_input: 'Buy groceries for dinner tonight',
      });

      // Should still create the task with raw text as title
      expect(mockPrisma.task.create).toHaveBeenCalled();
    });
  });

  // ── F1-S8: AI parsing timeout (BDD: @negative @boundary) ──

  describe('Scenario: AI parsing timeout exceeds 5 seconds', () => {
    it('should fall back to raw title when OpenAI times out', async () => {
      server.use(
        http.post('https://api.openai.com/v1/chat/completions', async () => {
          // Delay longer than the 5s timeout
          await new Promise((resolve) => setTimeout(resolve, 6000));
          return HttpResponse.json({ choices: [] });
        }),
      );

      const fallbackTask = taskFactory.build();
      mockPrisma.task.create.mockResolvedValue(fallbackTask);

      const result = await tasksService.createTask('user-1', {
        title: 'Finish the quarterly report',
        raw_input: 'Finish the quarterly report',
      });

      expect(mockPrisma.task.create).toHaveBeenCalled();
    }, 10_000);
  });

  // ── List Tasks with Cursor Pagination ──

  describe('Scenario: List tasks with cursor pagination', () => {
    it('should return paginated results with has_more and cursor', async () => {
      const tasks = taskFactory.buildList(11); // limit+1
      mockPrisma.task.findMany.mockResolvedValue(tasks);

      const result = await tasksService.listTasks('user-1', { limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.pagination.has_more).toBe(true);
      expect(result.pagination.cursor).toBe(tasks[9]!.id);
      expect(result.pagination.limit).toBe(10);
    });
  });

  describe('Scenario: List tasks — empty result', () => {
    it('should return empty data with has_more=false', async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);

      const result = await tasksService.listTasks('user-1', { limit: 10 });

      expect(result.data).toHaveLength(0);
      expect(result.pagination.has_more).toBe(false);
      expect(result.pagination.cursor).toBeNull();
    });
  });

  describe('Scenario: List tasks with status filter', () => {
    it('should pass status filter to Prisma query', async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);

      await tasksService.listTasks('user-1', { limit: 10, status: 'completed' });

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'completed' }),
        }),
      );
    });
  });

  // ── Get Single Task ──

  describe('Scenario: Get task excludes soft-deleted', () => {
    it('should query with deletedAt: null', async () => {
      const task = taskFactory.build();
      mockPrisma.task.findFirstOrThrow.mockResolvedValue(task);

      await tasksService.getTask('user-1', 'task-1');

      expect(mockPrisma.task.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: 'task-1', userId: 'user-1', deletedAt: null },
      });
    });
  });

  // ── Update Task ──

  describe('Scenario: Update task status to completed sets completedAt', () => {
    it('should set completedAt when status becomes completed', async () => {
      mockPrisma.task.update.mockResolvedValue(taskFactory.build({ status: 'completed' }));

      await tasksService.updateTask('user-1', 'task-1', { status: 'completed' });

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: 'task-1', userId: 'user-1' },
        data: expect.objectContaining({
          status: 'completed',
          completedAt: expect.any(Date),
        }),
      });
    });
  });

  // ── Delete Task (Soft Delete) ──

  describe('Scenario: Delete task sets deletedAt', () => {
    it('should soft-delete by setting deletedAt instead of removing', async () => {
      mockPrisma.task.update.mockResolvedValue(taskFactory.build({ deletedAt: new Date() }));

      await tasksService.deleteTask('user-1', 'task-1');

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: 'task-1', userId: 'user-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });

  // ── Parse Task — AI Integration ──

  describe('Scenario: parseTask returns structured fields from AI', () => {
    it('should return title, deadline, category, energy, minutes, confidence', async () => {
      const result = await tasksService.parseTask({
        input: 'Call Sarah about the Johnson proposal by Friday 2 PM',
      });

      expect(result.title).toBeDefined();
      expect(result.title.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThanOrEqual(0.5);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Scenario: parseTask falls back when OPENAI_API_KEY missing', () => {
    it('should return fallback with low confidence when env validation fails', async () => {
      // Override env mock to throw
      vi.doMock('../src/lib/env.js', () => ({
        validateEnv: () => {
          throw new Error('Missing OPENAI_API_KEY');
        },
      }));

      // Re-import to pick up new mock
      const freshModule = await import('../src/routes/tasks/tasks.service.js');

      const result = await freshModule.parseTask({ input: 'Test task' });

      expect(result.title).toBe('Test task');
      expect(result.confidence).toBe(0.3);
    });
  });

  // ── Priority Score Calculation ──

  describe('Scenario: Priority score — past-due deadline gets maximum urgency', () => {
    it('should assign score >= 0.80 for past-due tasks', async () => {
      const pastDeadline = new Date(Date.now() - 3600 * 1000).toISOString();
      mockPrisma.task.create.mockImplementation(({ data }) => Promise.resolve(data));

      await tasksService.createTask('user-1', {
        title: 'Overdue task',
        deadline: pastDeadline,
        energy_level: 'high',
      });

      const createCall = mockPrisma.task.create.mock.calls[0]![0];
      expect(createCall.data.priorityScore).toBeGreaterThanOrEqual(0.8);
    });
  });

  describe('Scenario: Priority score — no deadline or energy', () => {
    it('should assign base score of 0.50', async () => {
      mockPrisma.task.create.mockImplementation(({ data }) => Promise.resolve(data));

      await tasksService.createTask('user-1', { title: 'Simple task' });

      const createCall = mockPrisma.task.create.mock.calls[0]![0];
      expect(createCall.data.priorityScore).toBe(0.5);
    });
  });

  describe('Scenario: Priority score — deadline within 24h + high energy', () => {
    it('should assign score = (50 + 28 + 20) / 100 = 0.98', async () => {
      const tomorrowDeadline = new Date(Date.now() + 12 * 3600 * 1000).toISOString();
      mockPrisma.task.create.mockImplementation(({ data }) => Promise.resolve(data));

      await tasksService.createTask('user-1', {
        title: 'Urgent task',
        deadline: tomorrowDeadline,
        energy_level: 'high',
      });

      const createCall = mockPrisma.task.create.mock.calls[0]![0];
      expect(createCall.data.priorityScore).toBe(0.98);
    });
  });

  // ── F1-S9: Boundary — max character limit ──

  describe('Scenario: Task input at maximum 500 characters', () => {
    it('should handle 500-character input without truncation', async () => {
      const longInput = 'A'.repeat(500);
      mockPrisma.task.create.mockImplementation(({ data }) => Promise.resolve(data));

      await tasksService.createTask('user-1', {
        title: longInput,
        raw_input: longInput,
      });

      const createCall = mockPrisma.task.create.mock.calls[0]![0];
      expect(createCall.data.rawInput).toHaveLength(500);
    });
  });
});
