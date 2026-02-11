import { z } from "zod";

export const taskStatusEnum = z.enum(["active", "completed", "archived"]);
export const energyLevelEnum = z.enum(["low", "medium", "high"]).nullable();

export const taskCreateSchema = z.object({
  title: z.string().min(1).max(500),
  raw_input: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
  category: z.string().max(100).nullable().optional(),
  energy_level: energyLevelEnum.optional(),
  estimated_minutes: z.number().int().min(1).nullable().optional(),
});
export type TaskCreate = z.infer<typeof taskCreateSchema>;

export const taskUpdateSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
  category: z.string().max(100).nullable().optional(),
  status: taskStatusEnum.optional(),
  energy_level: energyLevelEnum.optional(),
  estimated_minutes: z.number().int().min(1).nullable().optional(),
  priority_override: z.number().int().min(1).max(5).nullable().optional(),
});
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;

export const taskListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: taskStatusEnum.optional(),
  category: z.string().optional(),
});
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;

export const taskParseRequestSchema = z.object({
  input: z.string().min(1).max(2000),
});
export type TaskParseRequest = z.infer<typeof taskParseRequestSchema>;

export const uuidParamSchema = z.object({
  task_id: z.string().uuid(),
});

export const taskResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string(),
  raw_input: z.string().nullable(),
  description: z.string().nullable(),
  deadline: z.string().datetime().nullable(),
  category: z.string().nullable(),
  priority_score: z.number(),
  priority_override: z.number().int().nullable(),
  status: taskStatusEnum,
  reasoning_json: z.record(z.unknown()).nullable(),
  energy_level: energyLevelEnum,
  estimated_minutes: z.number().int().nullable(),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const taskParseResponseSchema = z.object({
  title: z.string(),
  deadline: z.string().datetime().nullable().optional(),
  category: z.string().nullable().optional(),
  energy_level: energyLevelEnum.optional(),
  estimated_minutes: z.number().int().nullable().optional(),
  confidence: z.number().min(0).max(1),
  reasoning: z.record(z.unknown()).optional(),
});
