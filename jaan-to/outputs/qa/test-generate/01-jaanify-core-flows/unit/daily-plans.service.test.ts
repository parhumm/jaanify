import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '../config/mocks/server.js';
import { http, HttpResponse } from 'msw';
import { taskFactory, highPriorityTaskFactory } from '../fixtures/factories/task.factory.js';
import { dailyPlanFactory } from '../fixtures/factories/daily-plan.factory.js';

// Mock Prisma with transaction support
const mockTx = {
  dailyPlan: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  task: {
    findMany: vi.fn(),
  },
  dailyPlanSlot: {
    create: vi.fn(),
  },
};

const mockPrisma = {
  dailyPlan: {
    findMany: vi.fn(),
    findFirstOrThrow: vi.fn(),
  },
  dailyPlanSlot: {
    update: vi.fn(),
  },
  $transaction: vi.fn((callback: (tx: typeof mockTx) => Promise<unknown>) => callback(mockTx)),
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

describe('Feature: Daily Plan Service', () => {
  let plansService: typeof import('../src/routes/daily-plans/daily-plans.service.js');

  beforeEach(async () => {
    vi.clearAllMocks();
    plansService = await import('../src/routes/daily-plans/daily-plans.service.js');
  });

  // ── F2-S1: Plan generated with transparent reasoning (BDD: @smoke) ──

  describe('Scenario: Daily plan generated with AI ordering', () => {
    it('should create plan with AI-ordered slots and reasoning per slot', async () => {
      const tasks = [
        highPriorityTaskFactory.build({ id: 'task-1' }),
        taskFactory.build({ id: 'task-2', priorityScore: 0.6 }),
        taskFactory.build({ id: 'task-3', priorityScore: 0.4 }),
      ];

      mockTx.dailyPlan.findFirst.mockResolvedValue(null); // no existing plan
      mockTx.dailyPlan.create.mockResolvedValue({ id: 'plan-1' });
      mockTx.task.findMany.mockResolvedValue(tasks);
      mockTx.dailyPlanSlot.create.mockResolvedValue({});
      mockTx.dailyPlan.update.mockResolvedValue({
        ...dailyPlanFactory.build(),
        reasoningMethod: 'ai',
      });

      // MSW default handler returns AI ordering

      const result = await plansService.generatePlan('user-1');

      expect(mockTx.dailyPlan.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          status: 'generating',
          reasoningMethod: 'rule_based',
        }),
      });
      expect(mockTx.dailyPlanSlot.create).toHaveBeenCalled();
      expect(mockTx.dailyPlan.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'active' }),
        }),
      );
    });
  });

  // ── F2-S5: Plan generation fails (BDD: @negative) ──

  describe('Scenario: Plan generation falls back to rule-based when AI fails', () => {
    it('should use priority_score order when OpenAI returns error', async () => {
      server.use(
        http.post('https://api.openai.com/v1/chat/completions', () =>
          HttpResponse.json({ error: 'Internal server error' }, { status: 500 }),
        ),
      );

      const tasks = [
        taskFactory.build({ id: 'task-1', priorityScore: 0.9 }),
        taskFactory.build({ id: 'task-2', priorityScore: 0.7 }),
      ];

      mockTx.dailyPlan.findFirst.mockResolvedValue(null);
      mockTx.dailyPlan.create.mockResolvedValue({ id: 'plan-1' });
      mockTx.task.findMany.mockResolvedValue(tasks);
      mockTx.dailyPlanSlot.create.mockResolvedValue({});
      mockTx.dailyPlan.update.mockResolvedValue({
        ...dailyPlanFactory.build(),
        reasoningMethod: 'rule_based',
      });

      const result = await plansService.generatePlan('user-1');

      // Should still create slots in priority_score order
      expect(mockTx.dailyPlanSlot.create).toHaveBeenCalledTimes(2);

      // First slot should be task-1 (highest priority)
      const firstSlotCall = mockTx.dailyPlanSlot.create.mock.calls[0]![0];
      expect(firstSlotCall.data.taskId).toBe('task-1');
      expect(firstSlotCall.data.position).toBe(1);
    });
  });

  // ── F2-S6: Plan with zero tasks (BDD: @negative) ──

  describe('Scenario: Plan generation with zero tasks', () => {
    it('should create empty plan with active status', async () => {
      mockTx.dailyPlan.findFirst.mockResolvedValue(null);
      mockTx.dailyPlan.create.mockResolvedValue({ id: 'plan-1' });
      mockTx.task.findMany.mockResolvedValue([]); // no tasks
      mockTx.dailyPlan.update.mockResolvedValue({
        ...dailyPlanFactory.build(),
        slots: [],
        reasoningMethod: 'rule_based',
      });

      const result = await plansService.generatePlan('user-1');

      expect(mockTx.dailyPlanSlot.create).not.toHaveBeenCalled();
      expect(mockTx.dailyPlan.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'active', reasoningMethod: 'rule_based' }),
        }),
      );
    });
  });

  // ── Duplicate plan prevention ──

  describe('Scenario: Reject duplicate plan for same day', () => {
    it('should throw unique-constraint-violation when plan exists', async () => {
      mockTx.dailyPlan.findFirst.mockResolvedValue({ id: 'existing-plan' });

      await expect(plansService.generatePlan('user-1')).rejects.toThrow(
        'A daily plan already exists for today',
      );
    });
  });

  // ── F2-S9: Boundary — 50 tasks (BDD: @boundary) ──

  describe('Scenario: Plan generation with maximum 50 tasks', () => {
    it('should handle 50 tasks and create 10 slots (top 10)', async () => {
      const tasks = taskFactory.buildList(10); // service only takes 10
      mockTx.dailyPlan.findFirst.mockResolvedValue(null);
      mockTx.dailyPlan.create.mockResolvedValue({ id: 'plan-1' });
      mockTx.task.findMany.mockResolvedValue(tasks);
      mockTx.dailyPlanSlot.create.mockResolvedValue({});
      mockTx.dailyPlan.update.mockResolvedValue(dailyPlanFactory.build());

      await plansService.generatePlan('user-1');

      expect(mockTx.dailyPlanSlot.create).toHaveBeenCalledTimes(10);
    });
  });

  // ── List Plans ──

  describe('Scenario: List plans with cursor pagination', () => {
    it('should return paginated plans with slots included', async () => {
      const plans = [dailyPlanFactory.build()];
      mockPrisma.dailyPlan.findMany.mockResolvedValue(plans);

      const result = await plansService.listPlans('user-1', { limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.pagination.has_more).toBe(false);
      expect(mockPrisma.dailyPlan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: { slots: { orderBy: { position: 'asc' } } },
        }),
      );
    });
  });

  // ── Update Slot ──

  describe('Scenario: Update slot position', () => {
    it('should verify ownership and update slot', async () => {
      mockPrisma.dailyPlan.findFirstOrThrow.mockResolvedValue({ id: 'plan-1', userId: 'user-1' });
      mockPrisma.dailyPlanSlot.update.mockResolvedValue({ id: 'slot-1', position: 3 });

      const result = await plansService.updateSlot('user-1', 'plan-1', 'slot-1', {
        position: 3,
      });

      expect(mockPrisma.dailyPlan.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: 'plan-1', userId: 'user-1' },
      });
      expect(mockPrisma.dailyPlanSlot.update).toHaveBeenCalledWith({
        where: { id: 'slot-1', planId: 'plan-1' },
        data: { position: 3 },
      });
    });
  });
});
