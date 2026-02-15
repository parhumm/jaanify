import type { FastifyInstance, FastifyError } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";
import { Prisma } from "@prisma/client";

export async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    const requestId = request.id;

    if (hasZodFastifySchemaValidationErrors(error)) {
      const zodErrors = error.validation.map((v) => ({
        detail: v.message,
        pointer: v.instancePath || `/${v.params?.issue?.path?.join("/") ?? "unknown"}`,
      }));

      return reply.status(400).header("Content-Type", "application/problem+json").send({
        type: "https://api.jaanify.com/errors/validation",
        status: 400,
        title: "Validation Error",
        detail: `${zodErrors.length} validation error(s) in request`,
        instance: request.url,
        errors: zodErrors,
      });
    }

    if (isResponseSerializationError(error)) {
      request.log.error({ err: error }, "Response serialization failed");
      return reply.status(500).header("Content-Type", "application/problem+json").send({
        type: "https://api.jaanify.com/errors/internal",
        status: 500,
        title: "Internal Server Error",
        detail: "Response serialization failed.",
        instance: request.url,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return reply.status(409).header("Content-Type", "application/problem+json").send({
            type: "https://api.jaanify.com/errors/conflict",
            status: 409,
            title: "Conflict",
            detail: "A record with the given values already exists.",
            instance: request.url,
          });
        case "P2003":
          return reply.status(409).header("Content-Type", "application/problem+json").send({
            type: "https://api.jaanify.com/errors/conflict",
            status: 409,
            title: "Foreign Key Violation",
            detail: "Referenced record does not exist.",
            instance: request.url,
          });
        case "P2025":
          return reply.status(404).header("Content-Type", "application/problem+json").send({
            type: "https://api.jaanify.com/errors/not-found",
            status: 404,
            title: "Not Found",
            detail: "The requested record was not found.",
            instance: request.url,
          });
        default:
          request.log.error({ err: error, code: error.code }, "Prisma error");
          break;
      }
    }

    if ("statusCode" in error && typeof error.statusCode === "number") {
      return reply
        .status(error.statusCode)
        .header("Content-Type", "application/problem+json")
        .send({
          type: `https://api.jaanify.com/errors/${error.statusCode}`,
          status: error.statusCode,
          title: error.message,
          instance: request.url,
        });
    }

    request.log.error({ err: error, requestId }, "Unhandled error");
    return reply.status(500).header("Content-Type", "application/problem+json").send({
      type: "https://api.jaanify.com/errors/internal",
      status: 500,
      title: "Internal Server Error",
      detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      instance: request.url,
    });
  });
}
