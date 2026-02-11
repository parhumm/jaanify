import { z } from "zod";

export const guestSessionCreateSchema = z.object({
  data_json: z.record(z.unknown()).optional(),
});
export type GuestSessionCreate = z.infer<typeof guestSessionCreateSchema>;

export const guestSessionResponseSchema = z.object({
  id: z.string().uuid(),
  anonymous_id: z.string(),
  data_json: z.record(z.unknown()),
  expires_at: z.string().datetime(),
  created_at: z.string().datetime(),
});

export const anonymousIdParamSchema = z.object({
  anonymous_id: z.string().max(64),
});
