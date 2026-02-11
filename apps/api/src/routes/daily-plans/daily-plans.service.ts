import { prisma } from "../../lib/prisma.js";
import { BusinessError } from "../../lib/error-factory.js";
import { validateEnv } from "../../lib/env.js";
import type { DailyPlanSlotUpdate } from "./daily-plans.schema.js";

/** Minimal task shape sent to OpenAI for ordering */
interface TaskSummary {
  id: string;
  title: string;
  deadline: string | null;
  category: string | null;
  energy_level: string | null;
  estimated_minutes: number | null;
  priority_score: string;
}

/** Expected shape of each item in the OpenAI ordering response */
interface OrderedTaskItem {
  task_id: string;
  reasoning: string;
}

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
  return prisma.$transaction(
    async (tx) => {
      // 1. Get today's date (UTC, midnight)
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // 2. Check if a plan already exists for this user + today
      const existing = await tx.dailyPlan.findFirst({
        where: { userId, date: today },
      });
      if (existing) {
        throw new BusinessError(
          "unique-constraint-violation",
          "A daily plan already exists for today",
        );
      }

      // 3. Create the plan with status 'generating'
      const plan = await tx.dailyPlan.create({
        data: {
          userId,
          date: today,
          status: "generating",
          reasoningMethod: "rule_based",
        },
      });

      // 4. Fetch top 10 active tasks for this user, ordered by priority_score DESC
      const tasks = await tx.task.findMany({
        where: {
          userId,
          status: "active",
          deletedAt: null,
        },
        orderBy: { priorityScore: "desc" },
        take: 10,
      });

      // If no tasks, mark plan as active with no slots and return
      if (tasks.length === 0) {
        const emptyPlan = await tx.dailyPlan.update({
          where: { id: plan.id },
          data: {
            status: "active",
            reasoningMethod: "rule_based",
            generatedAt: new Date(),
          },
          include: { slots: true },
        });
        return emptyPlan;
      }

      // 5. Try AI-powered ordering, fall back to priority_score order
      let orderedTaskIds: string[] = tasks.map((t) => t.id);
      let slotReasonings: Map<string, Record<string, unknown>> = new Map();
      let reasoningMethod: "ai" | "rule_based" = "rule_based";

      let apiKey: string | undefined;
      try {
        const env = validateEnv();
        apiKey = env.OPENAI_API_KEY;
      } catch {
        // env validation failed — fall through to rule_based
      }

      if (apiKey) {
        try {
          const taskSummaries: TaskSummary[] = tasks.map((t) => ({
            id: t.id,
            title: t.title,
            deadline: t.deadline ? t.deadline.toISOString() : null,
            category: t.category,
            energy_level: t.energyLevel,
            estimated_minutes: t.estimatedMinutes,
            priority_score: String(t.priorityScore),
          }));

          const systemPrompt = [
            "You are a daily planner AI.",
            "Given a list of tasks, order them optimally for a productive day.",
            "Consider deadlines, energy levels, and estimated duration.",
            "Return a JSON object with a single key \"ordered_tasks\"",
            "containing an array of objects, each with \"task_id\" (string) and \"reasoning\" (string).",
            "The array should list task IDs in the recommended execution order.",
          ].join(" ");

          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);

          try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: JSON.stringify(taskSummaries) },
                ],
                response_format: { type: "json_object" },
                temperature: 0.3,
                max_tokens: 1000,
              }),
              signal: controller.signal,
            });

            if (response.ok) {
              const body = (await response.json()) as {
                choices: Array<{ message: { content: string } }>;
              };

              const content = body.choices[0]?.message?.content;
              if (content) {
                const parsed = JSON.parse(content) as {
                  ordered_tasks: OrderedTaskItem[];
                };

                if (Array.isArray(parsed.ordered_tasks) && parsed.ordered_tasks.length > 0) {
                  // Validate that all returned IDs are among the original tasks
                  const validIds = new Set(tasks.map((t) => t.id));
                  const aiIds = parsed.ordered_tasks
                    .map((item) => item.task_id)
                    .filter((id) => validIds.has(id));

                  if (aiIds.length === tasks.length) {
                    orderedTaskIds = aiIds;
                    reasoningMethod = "ai";

                    for (const item of parsed.ordered_tasks) {
                      if (validIds.has(item.task_id)) {
                        slotReasonings.set(item.task_id, { reasoning: item.reasoning });
                      }
                    }
                  }
                  // If AI returned partial/invalid IDs, fall back to rule_based order
                }
              }
            }
          } finally {
            clearTimeout(timeout);
          }
        } catch {
          // OpenAI call failed — fall back to rule_based ordering (already the default)
        }
      }

      // 6. Create DailyPlanSlot records
      for (let i = 0; i < orderedTaskIds.length; i++) {
        const taskId = orderedTaskIds[i]!;
        await tx.dailyPlanSlot.create({
          data: {
            planId: plan.id,
            taskId,
            position: i + 1,
            reasoningJson: slotReasonings.get(taskId) ?? null,
            status: "pending",
          },
        });
      }

      // 7. Update plan to active
      const completedPlan = await tx.dailyPlan.update({
        where: { id: plan.id },
        data: {
          status: "active",
          reasoningMethod,
          generatedAt: new Date(),
        },
        include: { slots: { orderBy: { position: "asc" } } },
      });

      return completedPlan;
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
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
