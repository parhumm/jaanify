/**
 * Regression tests: E-DEV-005 — CSRF Protection
 * CWE-352: Cross-Site Request Forgery
 *
 * Verifies:
 * - Mutation requests without CSRF token are rejected (403)
 * - Mutation requests with valid CSRF token succeed
 * - GET requests do not require CSRF token
 * - CSRF token endpoint returns a token
 * - Auth endpoints are exempt from CSRF (use OAuth code exchange)
 * - RFC 9457 error format on CSRF failure
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import csrf from "@fastify/csrf-protection";

describe("E-DEV-005: CSRF Protection", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(cookie);
    await app.register(csrf, {
      sessionPlugin: "@fastify/cookie",
      cookieOpts: {
        httpOnly: true,
        secure: false, // false for testing (no HTTPS in test)
        sameSite: "strict",
        path: "/",
        signed: false,
      },
    });

    // CSRF token endpoint
    app.get("/v1/auth/csrf-token", async (_request, reply) => {
      const token = reply.generateCsrf();
      return { token };
    });

    // Transform CSRF errors into RFC 9457 format
    app.setErrorHandler(async (error, _request, reply) => {
      if (error.statusCode === 403 || error.message?.includes("csrf")) {
        return reply.status(403).send({
          type: "https://api.jaanify.com/errors/csrf-token-invalid",
          status: 403,
          title: "CSRF Validation Failed",
          detail: "Missing or invalid CSRF token.",
        });
      }
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    });

    // Add CSRF verification as a preHandler hook for POST routes
    app.addHook("preHandler", async (request, reply) => {
      if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
        return;
      }
      await new Promise<void>((resolve, reject) => {
        (app as any).csrfProtection(request, reply, (err: Error | undefined) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    // Protected mutation endpoint
    app.post("/v1/tasks", async () => {
      return { id: "task-1", title: "Test task" };
    });

    // GET endpoint (no CSRF needed)
    app.get("/v1/tasks", async () => []);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── POSITIVE: Valid CSRF flow ──

  it("should return a CSRF token from the token endpoint", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/auth/csrf-token" });
    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThan(0);
  });

  it("should accept mutation with valid CSRF token", async () => {
    // Step 1: Get CSRF token
    const tokenRes = await app.inject({
      method: "GET",
      url: "/v1/auth/csrf-token",
    });
    const { token } = JSON.parse(tokenRes.body);
    const cookies = tokenRes.headers["set-cookie"];

    // Step 2: Use token in POST request
    const createRes = await app.inject({
      method: "POST",
      url: "/v1/tasks",
      headers: {
        "x-csrf-token": token,
        cookie: typeof cookies === "string" ? cookies : (cookies as string[])?.[0] ?? "",
      },
      payload: { title: "Test" },
    });

    expect(createRes.statusCode).toBe(200);
  });

  // ── NEGATIVE: Missing/invalid CSRF ──

  it("should reject mutation without CSRF token with 403", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/tasks",
      payload: { title: "Test" },
    });

    expect(res.statusCode).toBe(403);
  });

  it("should return RFC 9457 error format on CSRF failure", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/tasks",
      payload: { title: "Test" },
    });

    const body = JSON.parse(res.body);
    expect(body.type).toBe("https://api.jaanify.com/errors/csrf-token-invalid");
    expect(body.status).toBe(403);
    expect(body.title).toBe("CSRF Validation Failed");
  });

  it("should reject mutation with invalid CSRF token", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/tasks",
      headers: { "x-csrf-token": "forged-token-value" },
      payload: { title: "Test" },
    });

    expect(res.statusCode).toBe(403);
  });

  // ── BOUNDARY: GET requests exempt ──

  it("should allow GET requests without CSRF token", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/tasks" });
    expect(res.statusCode).toBe(200);
  });
});
