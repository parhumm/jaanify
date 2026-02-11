import type { FastifyInstance } from "fastify";
import { googleAuthRequestSchema, authTokensSchema, registerRequestSchema } from "./auth.schema.js";
import * as authService from "./auth.service.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/google", {
    schema: {
      body: googleAuthRequestSchema,
      response: { 200: authTokensSchema },
    },
    handler: async (request, reply) => {
      const tokens = await authService.googleAuth(request.body as any);
      return reply.status(200).send(tokens);
    },
  });

  fastify.post("/auth/refresh", {
    handler: async (request, reply) => {
      const tokens = await authService.refreshToken();
      return reply.status(200).send(tokens);
    },
  });

  fastify.post("/auth/register", {
    schema: {
      body: registerRequestSchema,
      response: { 200: authTokensSchema },
    },
    handler: async (request, reply) => {
      const tokens = await authService.register(request.body as any);
      return reply.status(200).send(tokens);
    },
  });

  fastify.delete("/auth/logout", {
    handler: async (request, reply) => {
      await authService.logout(request.userId);
      return reply.status(204).send();
    },
  });
}
