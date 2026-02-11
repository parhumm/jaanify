import type { FastifyInstance } from "fastify";
import {
  cursorParamSchema,
  planIdParamSchema,
  slotIdParamSchema,
  dailyPlanResponseSchema,
  dailyPlanSlotUpdateSchema,
  dailyPlanSlotSchema,
} from "./daily-plans.schema.js";
import * as planService from "./daily-plans.service.js";

export async function dailyPlanRoutes(fastify: FastifyInstance) {
  fastify.get("/daily-plans", {
    schema: { querystring: cursorParamSchema },
    handler: async (request, reply) => {
      const result = await planService.listPlans(request.userId, request.query as any);
      return reply.send(result);
    },
  });

  fastify.get("/daily-plans/:plan_id", {
    schema: {
      params: planIdParamSchema,
      response: { 200: dailyPlanResponseSchema },
    },
    handler: async (request, reply) => {
      const { plan_id } = request.params as any;
      const plan = await planService.getPlan(request.userId, plan_id);
      return reply.send(plan);
    },
  });

  fastify.post("/daily-plans/generate", {
    schema: { response: { 201: dailyPlanResponseSchema } },
    handler: async (request, reply) => {
      const plan = await planService.generatePlan(request.userId);
      return reply.status(201).send(plan);
    },
  });

  fastify.patch("/daily-plans/:plan_id/slots/:slot_id", {
    schema: {
      params: slotIdParamSchema,
      body: dailyPlanSlotUpdateSchema,
      response: { 200: dailyPlanSlotSchema },
    },
    handler: async (request, reply) => {
      const { plan_id, slot_id } = request.params as any;
      const slot = await planService.updateSlot(request.userId, plan_id, slot_id, request.body as any);
      return reply.send(slot);
    },
  });
}
