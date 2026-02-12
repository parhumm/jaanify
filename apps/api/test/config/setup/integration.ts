import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { server } from '../mocks/server.js';

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL ?? 'postgresql://test:test@localhost:5432/jaanify_test',
});

// Start MSW for external API mocking (OpenAI, Google OAuth)
beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'warn' });
  await prisma.$connect();
});

// Transaction-based isolation: each test runs in a rolled-back transaction
beforeEach(async () => {
  // Truncate all tables for isolation
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "User", "Task", "DailyPlan", "DailyPlanSlot",
    "UserFeedback", "GuestSession", "AuditLog" CASCADE;
  `);
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(async () => {
  server.close();
  await prisma.$disconnect();
});
