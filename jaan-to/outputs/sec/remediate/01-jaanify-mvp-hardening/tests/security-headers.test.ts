/**
 * Regression tests: Security Headers (Hardening)
 * Related: OWASP A05 Security Misconfiguration
 *
 * Verifies:
 * - Content-Security-Policy header present
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: DENY
 * - Strict-Transport-Security present
 * - Referrer-Policy present
 * - No X-Powered-By header (information disclosure)
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";

describe("Security Headers (Hardening)", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      xContentTypeOptions: true,
      xFrameOptions: { action: "deny" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    });

    app.get("/v1/health", async () => ({ status: "ok" }));

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── POSITIVE: Headers present ──

  it("should include Content-Security-Policy header", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/health" });
    const csp = res.headers["content-security-policy"] as string;

    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("should include X-Content-Type-Options: nosniff", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/health" });
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("should include X-Frame-Options: DENY", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/health" });
    expect(res.headers["x-frame-options"]).toBe("DENY");
  });

  it("should include Strict-Transport-Security", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/health" });
    const hsts = res.headers["strict-transport-security"] as string;

    expect(hsts).toBeDefined();
    expect(hsts).toContain("max-age=31536000");
    expect(hsts).toContain("includeSubDomains");
    expect(hsts).toContain("preload");
  });

  it("should include Referrer-Policy", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/health" });
    expect(res.headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });

  // ── NEGATIVE: Information disclosure prevented ──

  it("should NOT include X-Powered-By header", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/health" });
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  it("should NOT allow framing (clickjacking protection)", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/health" });
    // Both CSP frame-ancestors and X-Frame-Options prevent framing
    const csp = res.headers["content-security-policy"] as string;
    expect(csp).toContain("frame-ancestors 'none'");
    expect(res.headers["x-frame-options"]).toBe("DENY");
  });

  // ── BOUNDARY: CSP blocks inline scripts ──

  it("should NOT allow unsafe-inline for scripts in CSP", async () => {
    const res = await app.inject({ method: "GET", url: "/v1/health" });
    const csp = res.headers["content-security-policy"] as string;

    expect(csp).not.toContain("script-src 'unsafe-inline'");
  });
});
