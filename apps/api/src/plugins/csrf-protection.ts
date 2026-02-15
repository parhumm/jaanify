/**
 * Fix: E-DEV-005 — Missing CSRF Protection on Mutation Endpoints
 * CWE-352: Cross-Site Request Forgery
 *
 * Defense layers:
 * 1. SameSite=Strict on auth cookies (primary defense — see secure-token-storage.ts)
 * 2. @fastify/csrf-protection with double-submit cookie pattern (defense-in-depth)
 * 3. CORS origin validation (already present in app.ts)
 *
 * Integration: Register in app.ts AFTER cookie plugin, BEFORE routes.
 *
 * @example
 * ```ts
 * import { csrfPlugin } from "./fixes/csrf-protection.js";
 * await app.register(csrfPlugin);
 * ```
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

// ---------------------------------------------------------------------------
// CSRF Plugin Configuration
// ---------------------------------------------------------------------------

/**
 * Registers @fastify/csrf-protection using double-submit cookie pattern.
 *
 * How it works:
 * 1. Client calls GET /v1/auth/csrf-token → receives { token: "..." }
 *    and a __csrf cookie is set automatically
 * 2. Client sends the token in the x-csrf-token header on every mutation
 * 3. Plugin validates the header against the cookie
 *
 * SPA integration:
 * - On app load, call GET /v1/auth/csrf-token
 * - Store the token in memory (NOT localStorage)
 * - Add x-csrf-token header to all POST/PATCH/PUT/DELETE requests
 */
async function csrfPluginFn(fastify: FastifyInstance) {
  const csrf = await import("@fastify/csrf-protection");

  await fastify.register(csrf.default, {
    sessionPlugin: "@fastify/cookie",
    cookieOpts: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      signed: false,
    },
    getToken: (request: FastifyRequest) => {
      // Check x-csrf-token header (preferred for SPAs)
      return request.headers["x-csrf-token"] as string;
    },
  });

  // Token endpoint — clients call this to get a CSRF token
  fastify.get(
    "/v1/auth/csrf-token",
    { config: { public: true } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = reply.generateCsrf();
      return { token };
    },
  );

  // Add CSRF verification hook for mutation methods
  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Only verify CSRF on state-changing methods
      const mutationMethods = ["POST", "PUT", "PATCH", "DELETE"];
      if (!mutationMethods.includes(request.method)) return;

      // Skip CSRF for auth endpoints that use OAuth code exchange
      // (no cookie-based session at that point)
      const csrfExemptPaths = [
        "/v1/auth/google",
        "/v1/auth/register",
      ];
      if (csrfExemptPaths.some((p) => request.url.startsWith(p))) return;

      try {
        await (fastify as any).csrfProtection(request, reply);
      } catch {
        return reply
          .status(403)
          .header("Content-Type", "application/problem+json")
          .send({
            type: "https://api.jaanify.com/errors/csrf-token-invalid",
            status: 403,
            title: "CSRF Validation Failed",
            detail:
              "Missing or invalid CSRF token. Fetch a token from GET /v1/auth/csrf-token.",
            instance: request.url,
          });
      }
    },
  );
}

export const csrfPlugin = fp(csrfPluginFn, {
  name: "csrf-protection",
  fastify: "5.x",
  dependencies: ["@fastify/cookie"],
});
