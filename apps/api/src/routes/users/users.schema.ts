import { z } from "zod";

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  name: z.string().max(100).nullable(),
  avatar_url: z.string().url().nullable(),
  auth_provider: z.enum(["google", "email", "guest"]),
  preferences_json: z.record(z.unknown()).default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type UserResponse = z.infer<typeof userResponseSchema>;

export const userUpdateSchema = z.object({
  name: z.string().max(100).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  preferences_json: z.record(z.unknown()).optional(),
});
export type UserUpdate = z.infer<typeof userUpdateSchema>;
