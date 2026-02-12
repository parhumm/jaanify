import { PrismaClient } from '@prisma/client';
import { userFactory, googleUserFactory } from './factories/user.factory.js';
import { taskFactory, taskWithDeadlineFactory, highPriorityTaskFactory } from './factories/task.factory.js';
import { guestSessionFactory } from './factories/guest-session.factory.js';

const prisma = new PrismaClient();

/**
 * Named seed scenarios mapping to BDD Background steps.
 * Each scenario creates the exact data needed for a set of tests.
 */

/** Seed: Logged-in user with 5 tasks for dashboard scenarios (F2, F5, F6) */
export async function seedDashboardUser() {
  const user = await prisma.user.create({
    data: {
      ...googleUserFactory.build(),
      id: undefined, // let Prisma generate
    },
  });

  const tasks = [];
  for (let i = 0; i < 5; i++) {
    const taskData = i === 0
      ? highPriorityTaskFactory.build({ userId: user.id, id: undefined })
      : taskFactory.build({
          userId: user.id,
          id: undefined,
          deadline: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
          priorityScore: 0.8 - i * 0.1,
        });

    tasks.push(await prisma.task.create({ data: taskData }));
  }

  return { user, tasks };
}

/** Seed: User with task that has AI-enriched metadata (F1, F5) */
export async function seedUserWithAITask() {
  const user = await prisma.user.create({
    data: { ...googleUserFactory.build(), id: undefined },
  });

  const task = await prisma.task.create({
    data: {
      ...taskWithDeadlineFactory.build({ userId: user.id, id: undefined }),
    },
  });

  return { user, task };
}

/** Seed: Guest session with tasks for onboarding-to-register flow (F4) */
export async function seedGuestSession() {
  const session = await prisma.guestSession.create({
    data: {
      ...guestSessionFactory.build({ id: undefined }),
    },
  });

  return { session };
}

/** Seed: User with 50 tasks for boundary testing (F2-S9) */
export async function seedMaxTasks() {
  const user = await prisma.user.create({
    data: { ...googleUserFactory.build(), id: undefined },
  });

  const tasks = [];
  for (let i = 0; i < 50; i++) {
    tasks.push(
      await prisma.task.create({
        data: taskFactory.build({
          userId: user.id,
          id: undefined,
          priorityScore: (50 - i) / 50,
        }),
      }),
    );
  }

  return { user, tasks };
}

/** Truncate all tables — call before each test for isolation */
export async function truncateAll() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "User", "Task", "DailyPlan", "DailyPlanSlot",
    "UserFeedback", "GuestSession", "AuditLog" CASCADE;
  `);
}

export { prisma };
