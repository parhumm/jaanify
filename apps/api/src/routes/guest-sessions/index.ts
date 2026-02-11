import type { FastifyInstance } from "fastify";
import { guestSessionCreateSchema, guestSessionResponseSchema, anonymousIdParamSchema } from "./guest-sessions.schema.js";
import * as guestService from "./guest-sessions.service.js";

export async function guestSessionRoutes(fastify: FastifyInstance) {
  fastify.post("/guest-sessions", {
    schema: {
      body: guestSessionCreateSchema,
      response: { 201: guestSessionResponseSchema },
    },
    handler: async (request, reply) => {
      const session = await guestService.createGuestSession(request.body as any);
      return reply.status(201).send(session);
    },
  });

  fastify.get("/guest-sessions/:anonymous_id", {
    schema: {
      params: anonymousIdParamSchema,
      response: { 200: guestSessionResponseSchema },
    },
    handler: async (request, reply) => {
      const { anonymous_id } = request.params as any;
      const session = await guestService.getGuestSession(anonymous_id);
      return reply.send(session);
    },
  });
}
