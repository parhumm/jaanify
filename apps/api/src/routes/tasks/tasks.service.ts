import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { validateEnv } from "../../lib/env.js";
import type { TaskCreate, TaskUpdate, TaskListQuery, TaskParseRequest } from "./tasks.schema.js";

/** Shape returned by parseTask */
interface TaskParseResponse {
  title: string;
  deadline: string | null;
  category: string | null;
  energy_level: "low" | "medium" | "high" | null;
  estimated_minutes: number | null;
  confidence: number;
  reasoning: Record<string, unknown> | undefined;
}

/** Shape the OpenAI JSON response is expected to match */
interface OpenAIParsedFields {
  title?: string;
  deadline?: string | null;
  category?: string | null;
  energy_level?: "low" | "medium" | "high" | null;
  estimated_minutes?: number | null;
  reasoning?: Record<string, unknown>;
}

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

/**
 * Calculates a priority score for a task based on its attributes.
 *   base 50 + deadline proximity bonus (up to 30) + energy match bonus (up to 20)
 * Result is normalised to a 0-1 Decimal(5,4) range for the DB.
 */
function calculatePriorityScore(fields: {
  deadline: string | null | undefined;
  energy_level: "low" | "medium" | "high" | null | undefined;
}): number {
  let score = 50;

  // Deadline proximity bonus — closer deadlines score higher (max 30)
  if (fields.deadline) {
    const deadlineDate = new Date(fields.deadline);
    const now = new Date();
    const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeadline <= 0) {
      // Past due — maximum urgency
      score += 30;
    } else if (hoursUntilDeadline <= 24) {
      score += 28;
    } else if (hoursUntilDeadline <= 72) {
      score += 22;
    } else if (hoursUntilDeadline <= 168) {
      // Within 1 week
      score += 15;
    } else if (hoursUntilDeadline <= 720) {
      // Within 30 days
      score += 8;
    }
    // Beyond 30 days: no bonus
  }

  // Energy-level bonus (max 20) — higher-energy tasks are prioritised first
  if (fields.energy_level === "high") {
    score += 20;
  } else if (fields.energy_level === "medium") {
    score += 12;
  } else if (fields.energy_level === "low") {
    score += 5;
  }

  // Normalise from 0-100 range to 0.0000-1.0000 for Decimal(5,4) column
  return Math.min(score / 100, 1);
}

export async function createTask(userId: string, data: TaskCreate) {
  let enrichedTitle = data.title;
  let enrichedDeadline: string | null | undefined = data.deadline;
  let enrichedCategory: string | null | undefined = data.category;
  let enrichedEnergy: "low" | "medium" | "high" | null | undefined = data.energy_level;
  let enrichedMinutes: number | null | undefined = data.estimated_minutes;
  let reasoningJson: Prisma.InputJsonValue | null = null;

  // When raw_input is provided, use AI parsing to enrich the task
  if (data.raw_input) {
    const parsed = await parseTask({ input: data.raw_input });

    // Only override with parsed values when the caller did not supply explicit ones
    if (!data.title || data.title === data.raw_input) {
      enrichedTitle = parsed.title;
    }
    if (enrichedDeadline === undefined || enrichedDeadline === null) {
      enrichedDeadline = parsed.deadline;
    }
    if (enrichedCategory === undefined || enrichedCategory === null) {
      enrichedCategory = parsed.category;
    }
    if (enrichedEnergy === undefined || enrichedEnergy === null) {
      enrichedEnergy = parsed.energy_level;
    }
    if (enrichedMinutes === undefined || enrichedMinutes === null) {
      enrichedMinutes = parsed.estimated_minutes;
    }
    if (parsed.reasoning) {
      reasoningJson = { ...parsed.reasoning, confidence: parsed.confidence } as Prisma.InputJsonValue;
    }
  }

  const priorityScore = calculatePriorityScore({
    deadline: enrichedDeadline,
    energy_level: enrichedEnergy,
  });

  return prisma.task.create({
    data: {
      userId,
      title: enrichedTitle,
      rawInput: data.raw_input ?? null,
      description: data.description ?? null,
      deadline: enrichedDeadline ? new Date(enrichedDeadline) : null,
      category: enrichedCategory ?? null,
      energyLevel: enrichedEnergy ?? null,
      estimatedMinutes: enrichedMinutes ?? null,
      priorityScore,
      reasoningJson: reasoningJson ?? Prisma.DbNull,
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

export async function parseTask(data: TaskParseRequest): Promise<TaskParseResponse> {
  const fallback: TaskParseResponse = {
    title: data.input.slice(0, 100),
    deadline: null,
    category: null,
    energy_level: null,
    estimated_minutes: null,
    confidence: 0.3,
    reasoning: undefined,
  };

  let apiKey: string;
  try {
    const env = validateEnv();
    apiKey = env.OPENAI_API_KEY;
  } catch {
    return fallback;
  }

  const systemPrompt = [
    "You are a task parsing assistant.",
    "Extract structured task details from natural language input.",
    "Return JSON with:",
    "  title (string, required),",
    "  deadline (ISO8601 string or null),",
    "  category (string or null),",
    "  energy_level ('low'|'medium'|'high' or null),",
    "  estimated_minutes (number or null),",
    "  reasoning (object with your analysis)",
  ].join(" ");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: data.input },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 500,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return fallback;
    }

    const body = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = body.choices[0]?.message?.content;
    if (!content) {
      return fallback;
    }

    const parsed: OpenAIParsedFields = JSON.parse(content) as OpenAIParsedFields;

    // Calculate confidence: base 0.5 + 0.1 per extracted optional field
    let confidence = 0.5;
    if (parsed.deadline !== undefined && parsed.deadline !== null) confidence += 0.1;
    if (parsed.category !== undefined && parsed.category !== null) confidence += 0.1;
    if (parsed.energy_level !== undefined && parsed.energy_level !== null) confidence += 0.1;
    if (parsed.estimated_minutes !== undefined && parsed.estimated_minutes !== null) confidence += 0.1;
    if (parsed.reasoning !== undefined) confidence += 0.1;

    return {
      title: parsed.title ?? data.input.slice(0, 100),
      deadline: parsed.deadline ?? null,
      category: parsed.category ?? null,
      energy_level: parsed.energy_level ?? null,
      estimated_minutes: parsed.estimated_minutes ?? null,
      confidence: Math.min(confidence, 1),
      reasoning: parsed.reasoning,
    };
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}
