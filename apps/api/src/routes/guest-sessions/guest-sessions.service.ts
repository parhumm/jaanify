import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { GuestSessionCreate } from "./guest-sessions.schema.js";

export async function createGuestSession(data: GuestSessionCreate) {
  const anonymousId = randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return prisma.guestSession.create({
    data: {
      anonymousId,
      dataJson: (data.data_json ?? {}) as Prisma.InputJsonValue,
      expiresAt,
    },
  });
}

export async function getGuestSession(anonymousId: string) {
  return prisma.guestSession.findUniqueOrThrow({
    where: { anonymousId },
  });
}
