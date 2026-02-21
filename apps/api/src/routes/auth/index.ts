import type { FastifyInstance } from "fastify";
import { googleAuthRequestSchema, authResponseSchema, registerRequestSchema, problemDetailSchema } from "./auth.schema.js";
import * as authService from "./auth.service.js";
import { setAuthCookies, clearAuthCookies } from "../../lib/secure-cookies.js";
import { getRefreshToken } from "../../lib/cookie-helpers.js";

export async function authRoutes(fastify: FastifyInstance) {
  // POST /auth/google — Set cookies on Google login
  fastify.post("/auth/google", {
    schema: {
      body: googleAuthRequestSchema,
      response: { 200: authResponseSchema },
    },
    handler: async (request, reply) => {
      const tokens = await authService.googleAuth(request.body as any);

      // Set HttpOnly cookies
      setAuthCookies(reply, tokens);

      // Return access_token in body (for frontend in-memory store)
      // Do NOT return refresh_token in body
      return reply.status(200).send({
        access_token: tokens.access_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
      });
    },
  });

  // POST /auth/refresh — Read cookie, set new cookies
  fastify.post("/auth/refresh", {
    schema: {
      response: { 200: authResponseSchema, 401: problemDetailSchema },
    },
    handler: async (request, reply) => {
      const body = request.body as { refresh_token?: string } | undefined;

      // Read refresh token from cookie first, body fallback
      const refreshToken = getRefreshToken(request, body?.refresh_token);

      if (!refreshToken) {
        return reply
          .status(401)
          .header("Content-Type", "application/problem+json")
          .send({
            type: "https://api.jaanify.com/errors/authentication-required",
            status: 401,
            title: "Missing Refresh Token",
            detail:
              "No refresh token found in cookie or request body.",
            instance: request.url,
          });
      }

      const tokens = await authService.refreshToken(refreshToken);

      // Set fresh cookies
      setAuthCookies(reply, tokens);

      return reply.status(200).send({
        access_token: tokens.access_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
      });
    },
  });

  // POST /auth/register — Set cookies on registration
  fastify.post("/auth/register", {
    schema: {
      body: registerRequestSchema,
      response: { 200: authResponseSchema },
    },
    handler: async (request, reply) => {
      const tokens = await authService.register(request.body as any);

      // Set HttpOnly cookies
      setAuthCookies(reply, tokens);

      return reply.status(200).send({
        access_token: tokens.access_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
      });
    },
  });

  // DELETE /auth/logout — Clear cookies
  fastify.delete("/auth/logout", {
    handler: async (request, reply) => {
      await authService.logout(request.userId);

      // Clear HttpOnly cookies (client can't do this via JS)
      clearAuthCookies(reply);

      return reply.status(204).send();
    },
  });
}
