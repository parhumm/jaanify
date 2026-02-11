import { z } from "zod";

export const googleAuthRequestSchema = z.object({
  code: z.string().min(1),
  redirect_uri: z.string().url(),
});
export type GoogleAuthRequest = z.infer<typeof googleAuthRequestSchema>;

export const registerRequestSchema = z.object({
  anonymous_id: z.string().min(1).max(64),
  provider: z.enum(["google", "email"]),
  code: z.string().min(1),
});
export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const authTokensSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  token_type: z.literal("Bearer"),
  expires_in: z.number().int(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;
