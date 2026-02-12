/**
 * Fix: E-DEV-002 — No Rate Limiting Configured
 * CWE-770: Allocation of Resources Without Limits or Throttling
 *
 * Registers @fastify/rate-limit with tiered limits:
 * - Auth endpoints: 5 req/min (brute-force protection)
 * - Write endpoints: 30 req/min
 * - Read endpoints: 100 req/min (global default)
 *
 * Integration: Register in app.ts BEFORE route registration.
 *
 * @example
 * ```ts
 * import rateLimit from "@fastify/rate-limit";
 * import { rateLimitConfig, authRateLimitConfig } from "./fixes/rate-limiter.js";
 *
 * await app.register(rateLimit, rateLimitConfig);
 * ```
 */

import type { FastifyInstance, RateLimitOptions } from "fastify";
import fp from "fastify-plugin";

// ---------------------------------------------------------------------------
// Global rate limit configuration (applies to all routes by default)
// ---------------------------------------------------------------------------

export const rateLimitConfig: RateLimitOptions = {
  max: 100,
  timeWindow: "1 minute",
  errorResponseBuilder: (_request, context) => ({
    type: "https://api.jaanify.com/errors/rate-limit-exceeded",
    status: 429,
    title: "Too Many Requests",
    detail: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
  }),
  addHeadersOnExceeding: {
    "x-ratelimit-limit": true,
    "x-ratelimit-remaining": true,
    "x-ratelimit-reset": true,
  },
  addHeaders: {
    "x-ratelimit-limit": true,
    "x-ratelimit-remaining": true,
    "x-ratelimit-reset": true,
    "retry-after": true,
  },
};

// ---------------------------------------------------------------------------
// Auth-specific rate limit (stricter)
// ---------------------------------------------------------------------------

/** Apply to auth routes: 5 req/min per IP to prevent brute-force. */
export const authRateLimitConfig = {
  config: {
    rateLimit: {
      max: 5,
      timeWindow: "1 minute",
    },
  },
};

// ---------------------------------------------------------------------------
// Write-endpoint rate limit
// ---------------------------------------------------------------------------

/** Apply to mutation routes (POST/PATCH/DELETE): 30 req/min per IP. */
export const writeRateLimitConfig = {
  config: {
    rateLimit: {
      max: 30,
      timeWindow: "1 minute",
    },
  },
};

// ---------------------------------------------------------------------------
// Plugin wrapper for app-level registration
// ---------------------------------------------------------------------------

/**
 * Fastify plugin that registers @fastify/rate-limit with the global config.
 *
 * Usage in app.ts:
 * ```ts
 * import { rateLimitPlugin } from "./fixes/rate-limiter.js";
 * await app.register(rateLimitPlugin);
 * ```
 */
async function rateLimitPluginFn(fastify: FastifyInstance) {
  const rateLimit = await import("@fastify/rate-limit");
  await fastify.register(rateLimit.default, rateLimitConfig);
}

export const rateLimitPlugin = fp(rateLimitPluginFn, {
  name: "rate-limit",
  fastify: "5.x",
});
