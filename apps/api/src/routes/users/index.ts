import type { FastifyInstance } from "fastify";
import { userResponseSchema, userUpdateSchema } from "./users.schema.js";
import * as userService from "./users.service.js";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get("/users/me", {
    schema: { response: { 200: userResponseSchema } },
    handler: async (request, reply) => {
      const user = await userService.getMe(request.userId);
      return reply.send(user);
    },
  });

  fastify.patch("/users/me", {
    schema: {
      body: userUpdateSchema,
      response: { 200: userResponseSchema },
    },
    handler: async (request, reply) => {
      const user = await userService.updateMe(request.userId, request.body as any);
      return reply.send(user);
    },
  });

  fastify.delete("/users/me", {
    handler: async (request, reply) => {
      await userService.deleteMe(request.userId);
      return reply.status(204).send();
    },
  });
}
