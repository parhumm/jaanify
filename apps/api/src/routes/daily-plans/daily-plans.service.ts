import { prisma } from "../../lib/prisma.js";
import type { DailyPlanSlotUpdate } from "./daily-plans.schema.js";

export async function listPlans(userId: string, params: { cursor?: string; limit: number }) {
  const plans = await prisma.dailyPlan.findMany({
    where: { userId },
    include: { slots: { orderBy: { position: "asc" } } },
    take: params.limit + 1,
    ...(params.cursor && { cursor: { id: params.cursor }, skip: 1 }),
    orderBy: { date: "desc" },
  });

  const hasMore = plans.length > params.limit;
  const data = hasMore ? plans.slice(0, params.limit) : plans;

  return {
    data,
    pagination: {
      cursor: hasMore ? data[data.length - 1]?.id ?? null : null,
      has_more: hasMore,
      limit: params.limit,
    },
  };
}

export async function getPlan(userId: string, planId: string) {
  return prisma.dailyPlan.findFirstOrThrow({
    where: { id: planId, userId },
    include: { slots: { orderBy: { position: "asc" } } },
  });
}

export async function generatePlan(userId: string) {
  // TODO: AI-powered daily plan generation
  // 1. Fetch active tasks for user
  // 2. Score and rank by priority, deadline, energy
  // 3. Create plan with ordered slots
  throw new Error("Not implemented");
}

export async function updateSlot(userId: string, planId: string, slotId: string, data: DailyPlanSlotUpdate) {
  // Verify ownership
  await prisma.dailyPlan.findFirstOrThrow({ where: { id: planId, userId } });

  return prisma.dailyPlanSlot.update({
    where: { id: slotId, planId },
    data: {
      ...(data.position !== undefined && { position: data.position }),
      ...(data.status !== undefined && { status: data.status }),
    },
  });
}
