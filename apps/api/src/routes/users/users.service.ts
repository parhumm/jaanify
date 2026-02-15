import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { UserUpdate } from "./users.schema.js";

export async function getMe(userId: string) {
  return prisma.user.findUniqueOrThrow({ where: { id: userId } });
}

export async function updateMe(userId: string, data: UserUpdate) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      avatarUrl: data.avatar_url,
      preferencesJson: (data.preferences_json as Prisma.InputJsonValue) ?? undefined,
    },
  });
}

export async function deleteMe(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  });
}
