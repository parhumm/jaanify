import type { FastifyInstance } from "fastify";
import {
  taskCreateSchema,
  taskUpdateSchema,
  taskListQuerySchema,
  taskParseRequestSchema,
  taskResponseSchema,
  taskParseResponseSchema,
  uuidParamSchema,
} from "./tasks.schema.js";
import * as taskService from "./tasks.service.js";

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.get("/tasks", {
    schema: {
      querystring: taskListQuerySchema,
    },
    handler: async (request, reply) => {
      const result = await taskService.listTasks(request.userId, request.query as any);
      return reply.send(result);
    },
  });

  fastify.get("/tasks/:task_id", {
    schema: { params: uuidParamSchema },
    handler: async (request, reply) => {
      const { task_id } = request.params as any;
      const task = await taskService.getTask(request.userId, task_id);
      return reply.send(task);
    },
  });

  fastify.post("/tasks", {
    schema: {
      body: taskCreateSchema,
      response: { 201: taskResponseSchema },
    },
    handler: async (request, reply) => {
      const task = await taskService.createTask(request.userId, request.body as any);
      return reply.status(201).send(task);
    },
  });

  fastify.patch("/tasks/:task_id", {
    schema: {
      params: uuidParamSchema,
      body: taskUpdateSchema,
    },
    handler: async (request, reply) => {
      const { task_id } = request.params as any;
      const task = await taskService.updateTask(request.userId, task_id, request.body as any);
      return reply.send(task);
    },
  });

  fastify.delete("/tasks/:task_id", {
    schema: { params: uuidParamSchema },
    handler: async (request, reply) => {
      const { task_id } = request.params as any;
      await taskService.deleteTask(request.userId, task_id);
      return reply.status(204).send();
    },
  });

  fastify.post("/tasks/parse", {
    schema: {
      body: taskParseRequestSchema,
      response: { 200: taskParseResponseSchema },
    },
    handler: async (request, reply) => {
      const result = await taskService.parseTask(request.body as any);
      return reply.send(result);
    },
  });
}
