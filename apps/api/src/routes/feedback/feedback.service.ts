import { prisma } from "../../lib/prisma.js";
import type { FeedbackCreate } from "./feedback.schema.js";

export async function createFeedback(userId: string, data: FeedbackCreate) {
  return prisma.userFeedback.create({
    data: {
      userId,
      taskId: data.task_id ?? null,
      planId: data.plan_id ?? null,
      feedbackType: data.feedback_type,
      reason: data.reason ?? null,
    },
  });
}
