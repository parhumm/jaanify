import { prisma } from "../../lib/prisma.js";
import type { TaskCreate, TaskUpdate, TaskListQuery, TaskParseRequest } from "./tasks.schema.js";

export async function listTasks(userId: string, query: TaskListQuery) {
  const { cursor, limit, status, category } = query;
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(status && { status }),
      ...(category && { category }),
    },
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { priorityScore: "desc" },
  });

  const hasMore = tasks.length > limit;
  const data = hasMore ? tasks.slice(0, limit) : tasks;

  return {
    data,
    pagination: {
      cursor: hasMore ? data[data.length - 1]?.id ?? null : null,
      has_more: hasMore,
      limit,
    },
  };
}

export async function getTask(userId: string, taskId: string) {
  return prisma.task.findFirstOrThrow({
    where: { id: taskId, userId, deletedAt: null },
  });
}

export async function createTask(userId: string, data: TaskCreate) {
  return prisma.task.create({
    data: {
      userId,
      title: data.title,
      rawInput: data.raw_input ?? null,
      description: data.description ?? null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      category: data.category ?? null,
      energyLevel: data.energy_level ?? null,
      estimatedMinutes: data.estimated_minutes ?? null,
    },
  });
}

export async function updateTask(userId: string, taskId: string, data: TaskUpdate) {
  return prisma.task.update({
    where: { id: taskId, userId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.deadline !== undefined && { deadline: data.deadline ? new Date(data.deadline) : null }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.energy_level !== undefined && { energyLevel: data.energy_level }),
      ...(data.estimated_minutes !== undefined && { estimatedMinutes: data.estimated_minutes }),
      ...(data.priority_override !== undefined && { priorityOverride: data.priority_override }),
      ...(data.status === "completed" && { completedAt: new Date() }),
    },
  });
}

export async function deleteTask(userId: string, taskId: string) {
  return prisma.task.update({
    where: { id: taskId, userId },
    data: { deletedAt: new Date() },
  });
}

export async function parseTask(data: TaskParseRequest) {
  // TODO: Integrate with OpenAI SDK for NLP parsing
  throw new Error("Not implemented");
}
