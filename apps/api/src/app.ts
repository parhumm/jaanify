import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import cookie from "@fastify/cookie";
import sensible from "@fastify/sensible";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { securityHeadersPlugin } from "./plugins/security-headers.js";
import { rateLimitPlugin } from "./plugins/rate-limiter.js";
import { csrfPlugin } from "./plugins/csrf-protection.js";
import { authMiddleware } from "./plugins/auth.js";
import { errorHandlerPlugin } from "./plugins/error-handler.js";
import { validateEnv } from "./lib/env.js";
import { authRoutes } from "./routes/auth/index.js";
import { userRoutes } from "./routes/users/index.js";
import { taskRoutes } from "./routes/tasks/index.js";
import { dailyPlanRoutes } from "./routes/daily-plans/index.js";
import { feedbackRoutes } from "./routes/feedback/index.js";
import { guestSessionRoutes } from "./routes/guest-sessions/index.js";

export async function buildApp() {
  const env = validateEnv();

  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === "development"
          ? { target: "pino-pretty" }
          : undefined,
    },
  });

  // Zod type provider
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Security & Infrastructure Plugins (order matters)
  await app.register(securityHeadersPlugin); // 1. Security headers (helmet)
  await app.register(cors, { origin: env.CORS_ORIGIN, credentials: true }); // 2. CORS
  await app.register(rateLimitPlugin); // 3. Rate limiting
  await app.register(cookie); // 4. Cookie parsing
  await app.register(csrfPlugin); // 5. CSRF protection (after cookie)
  await app.register(sensible); // 6. Error helpers
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Jaanify API",
        version: "1.0.0",
        description: "AI Task Manager that shows its work",
      },
      servers: [{ url: `http://${env.HOST}:${env.PORT}/v1` }],
    },
  });
  await app.register(swaggerUi, { routePrefix: "/docs" });

  // Error handler (RFC 9457)
  await app.register(errorHandlerPlugin);

  // Auth middleware
  await app.register(authMiddleware);

  // Health check
  app.get("/v1/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));

  // Routes — register each resource under /v1 prefix
  await app.register(authRoutes, { prefix: "/v1" });
  await app.register(userRoutes, { prefix: "/v1" });
  await app.register(taskRoutes, { prefix: "/v1" });
  await app.register(dailyPlanRoutes, { prefix: "/v1" });
  await app.register(feedbackRoutes, { prefix: "/v1" });
  await app.register(guestSessionRoutes, { prefix: "/v1" });

  return app;
}
