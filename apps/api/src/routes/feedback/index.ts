import type { FastifyInstance } from "fastify";
import { feedbackCreateSchema, feedbackResponseSchema } from "./feedback.schema.js";
import * as feedbackService from "./feedback.service.js";

export async function feedbackRoutes(fastify: FastifyInstance) {
  fastify.post("/feedback", {
    schema: {
      body: feedbackCreateSchema,
      response: { 201: feedbackResponseSchema },
    },
    handler: async (request, reply) => {
      const feedback = await feedbackService.createFeedback(request.userId, request.body as any);
      return reply.status(201).send(feedback);
    },
  });
}
