import { z } from "zod";

export const cursorParamSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const planIdParamSchema = z.object({
  plan_id: z.string().uuid(),
});

export const slotIdParamSchema = z.object({
  plan_id: z.string().uuid(),
  slot_id: z.string().uuid(),
});

export const dailyPlanSlotSchema = z.object({
  id: z.string().uuid(),
  plan_id: z.string().uuid(),
  task_id: z.string().uuid(),
  position: z.number().int().min(1),
  reasoning_json: z.record(z.unknown()).nullable(),
  status: z.enum(["pending", "completed", "skipped"]),
});

export const dailyPlanSlotUpdateSchema = z.object({
  position: z.number().int().min(1).optional(),
  status: z.enum(["pending", "completed", "skipped"]).optional(),
});
export type DailyPlanSlotUpdate = z.infer<typeof dailyPlanSlotUpdateSchema>;

export const dailyPlanResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  date: z.string(),
  status: z.enum(["generating", "active", "completed"]),
  reasoning_method: z.enum(["ai", "rule_based"]),
  generated_at: z.string().datetime().nullable(),
  slots: z.array(dailyPlanSlotSchema),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
