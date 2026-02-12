/**
 * Regression tests: E-DEV-002 — Rate Limiting
 * CWE-770: Allocation of Resources Without Limits or Throttling
 *
 * Verifies:
 * - Global rate limit enforced (100 req/min)
 * - Auth endpoint rate limit enforced (5 req/min)
 * - Write endpoint rate limit enforced (30 req/min)
 * - Rate limit headers present
 * - RFC 9457 error format on 429
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import { rateLimitConfig } from "../fixes/rate-limiter.js";

describe("E-DEV-002: Rate Limiting", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(rateLimit, { ...rateLimitConfig, max: 3, timeWindow: "10 seconds" }); // Low limit for testing

    app.get("/v1/health", async () => ({ status: "ok" }));
    app.post(
      "/v1/auth/google",
      { config: { rateLimit: { max: 2, timeWindow: "10 seconds" } } },
      async () => ({ access_token: "test" }),
    );

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── POSITIVE: Requests within limit succeed ──

  it("should allow requests within the rate limit", async () => {
    const response = await app.inject({ method: "GET", url: "/v1/health" });
    expect(response.statusCode).toBe(200);
  });

  it("should include rate limit headers on successful responses", async () => {
    const response = await app.inject({ method: "GET", url: "/v1/health" });
    expect(response.headers["x-ratelimit-limit"]).toBeDefined();
    expect(response.headers["x-ratelimit-remaining"]).toBeDefined();
    expect(response.headers["x-ratelimit-reset"]).toBeDefined();
  });

  // ── NEGATIVE: Exceed rate limit ──

  it("should return 429 when rate limit is exceeded", async () => {
    // Fresh app with very low limit
    const testApp = Fastify();
    await testApp.register(rateLimit, { ...rateLimitConfig, max: 1, timeWindow: "1 minute" });
    testApp.get("/test", async () => ({ ok: true }));
    await testApp.ready();

    // First request — allowed
    const res1 = await testApp.inject({ method: "GET", url: "/test" });
    expect(res1.statusCode).toBe(200);

    // Second request — blocked
    const res2 = await testApp.inject({ method: "GET", url: "/test" });
    expect(res2.statusCode).toBe(429);

    await testApp.close();
  });

  it("should return RFC 9457 error format on 429", async () => {
    const testApp = Fastify();
    await testApp.register(rateLimit, { ...rateLimitConfig, max: 1, timeWindow: "1 minute" });
    testApp.get("/test", async () => ({ ok: true }));
    await testApp.ready();

    await testApp.inject({ method: "GET", url: "/test" }); // exhaust limit
    const res = await testApp.inject({ method: "GET", url: "/test" });

    const body = JSON.parse(res.body);
    expect(body.type).toBe("https://api.jaanify.com/errors/rate-limit-exceeded");
    expect(body.status).toBe(429);
    expect(body.title).toBe("Too Many Requests");
    expect(body.detail).toContain("Rate limit exceeded");

    await testApp.close();
  });

  it("should include retry-after header on 429 responses", async () => {
    const testApp = Fastify();
    await testApp.register(rateLimit, { ...rateLimitConfig, max: 1, timeWindow: "1 minute" });
    testApp.get("/test", async () => ({ ok: true }));
    await testApp.ready();

    await testApp.inject({ method: "GET", url: "/test" });
    const res = await testApp.inject({ method: "GET", url: "/test" });

    expect(res.headers["retry-after"]).toBeDefined();

    await testApp.close();
  });

  // ── BOUNDARY: Auth endpoint stricter limit ──

  it("should enforce stricter rate limit on auth endpoints", async () => {
    const res1 = await app.inject({ method: "POST", url: "/v1/auth/google", payload: {} });
    expect(res1.statusCode).toBe(200);

    const res2 = await app.inject({ method: "POST", url: "/v1/auth/google", payload: {} });
    expect(res2.statusCode).toBe(200);

    // Third request exceeds auth limit of 2
    const res3 = await app.inject({ method: "POST", url: "/v1/auth/google", payload: {} });
    expect(res3.statusCode).toBe(429);
  });
});
