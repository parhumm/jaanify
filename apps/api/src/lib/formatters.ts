/**
 * Fix: E-DEV-004 — Response Formatters Use Record<string, unknown>
 * CWE-843: Access of Resource Using Incompatible Type
 *
 * Replace untyped formatters with Prisma-typed formatters that
 * guarantee compile-time correctness at the response boundary.
 *
 * Integration: Replace existing formatters in route files with these.
 *
 * @example
 * ```ts
 * import { formatUserResponse, formatTaskResponse } from "./fixes/typed-formatters.js";
 *
 * // In route handler:
 * const user = await prisma.user.findUnique({ where: { id } });
 * return formatUserResponse(user);
 * ```
 */

import type { User, Task, DailyPlan, DailyPlanSlot, GuestSession } from "@prisma/client";

// ---------------------------------------------------------------------------
// User formatter
// ---------------------------------------------------------------------------

export interface UserResponse {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  auth_provider: string;
  created_at: string;
}

export function formatUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatarUrl,
    auth_provider: user.authProvider,
    created_at: user.createdAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Task formatter
// ---------------------------------------------------------------------------

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  raw_input: string | null;
  status: string;
  priority_score: number | null;
  category: string | null;
  energy_level: string | null;
  estimated_minutes: number | null;
  deadline: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function formatTaskResponse(task: Task): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    raw_input: task.rawInput,
    status: task.status,
    priority_score: task.priorityScore ? Number(task.priorityScore) : null,
    category: task.category,
    energy_level: task.energyLevel,
    estimated_minutes: task.estimatedMinutes,
    deadline: task.deadline?.toISOString() ?? null,
    completed_at: task.completedAt?.toISOString() ?? null,
    created_at: task.createdAt.toISOString(),
    updated_at: task.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// DailyPlan formatter
// ---------------------------------------------------------------------------

export interface DailyPlanResponse {
  id: string;
  date: string;
  status: string;
  reasoning_method: string;
  created_at: string;
  slots?: DailyPlanSlotResponse[];
}

export interface DailyPlanSlotResponse {
  id: string;
  position: number;
  task_id: string;
  status: string;
  reasoning_json: unknown;
}

export function formatDailyPlanResponse(
  plan: DailyPlan & { slots?: DailyPlanSlot[] },
): DailyPlanResponse {
  return {
    id: plan.id,
    date: plan.date.toISOString().split("T")[0]!,
    status: plan.status,
    reasoning_method: plan.reasoningMethod,
    created_at: plan.createdAt.toISOString(),
    ...(plan.slots
      ? {
          slots: plan.slots.map((slot) => ({
            id: slot.id,
            position: slot.position,
            task_id: slot.taskId,
            status: slot.status,
            reasoning_json: slot.reasoningJson,
          })),
        }
      : {}),
  };
}

// ---------------------------------------------------------------------------
// GuestSession formatter
// ---------------------------------------------------------------------------

export interface GuestSessionResponse {
  anonymous_id: string;
  expires_at: string;
  created_at: string;
  task_count: number;
}

export function formatGuestSessionResponse(session: GuestSession): GuestSessionResponse {
  const dataJson = session.dataJson as Record<string, unknown> | null;
  const tasks = Array.isArray(dataJson?.["tasks"]) ? dataJson["tasks"] : [];

  return {
    anonymous_id: session.anonymousId,
    expires_at: session.expiresAt.toISOString(),
    created_at: session.createdAt.toISOString(),
    task_count: tasks.length,
  };
}
