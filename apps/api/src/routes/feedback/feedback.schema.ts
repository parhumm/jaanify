import { z } from "zod";

export const feedbackTypeEnum = z.enum([
  "priority_override",
  "plan_override",
  "not_now",
  "wrong_category",
  "other",
]);

export const feedbackCreateSchema = z.object({
  task_id: z.string().uuid().nullable().optional(),
  plan_id: z.string().uuid().nullable().optional(),
  feedback_type: feedbackTypeEnum,
  reason: z.string().max(500).nullable().optional(),
});
export type FeedbackCreate = z.infer<typeof feedbackCreateSchema>;

export const feedbackResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  task_id: z.string().uuid().nullable(),
  plan_id: z.string().uuid().nullable(),
  feedback_type: feedbackTypeEnum,
  reason: z.string().nullable(),
  created_at: z.string().datetime(),
});
