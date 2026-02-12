/**
 * Regression tests: E-DEV-003 — Secure Token Storage
 * CWE-922: Insecure Storage of Sensitive Information
 *
 * Verifies:
 * - Refresh token cookie has httpOnly flag
 * - Refresh token cookie has Secure flag
 * - Refresh token cookie has SameSite=Strict
 * - Refresh token cookie path is restricted to /v1/auth
 * - Clear cookie actually removes the cookie
 * - Access token is NOT set in any cookie
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../fixes/secure-token-storage.js";

describe("E-DEV-003: Secure Token Storage", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    await app.register(cookie);

    // Test route that sets refresh token cookie
    app.get("/set-cookie", async (_request, reply) => {
      setRefreshTokenCookie(reply, "test-refresh-token-value");
      return { ok: true };
    });

    // Test route that clears refresh token cookie
    app.get("/clear-cookie", async (_request, reply) => {
      clearRefreshTokenCookie(reply);
      return { ok: true };
    });

    // Test route that returns access token in body only (never cookie)
    app.get("/get-tokens", async (_request, reply) => {
      setRefreshTokenCookie(reply, "refresh-token-123");
      return {
        access_token: "access-token-456",
        token_type: "Bearer",
        expires_in: 900,
      };
    });

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // ── POSITIVE: Cookie security properties ──

  it("should set refresh token as httpOnly cookie", async () => {
    const res = await app.inject({ method: "GET", url: "/set-cookie" });
    const setCookie = res.headers["set-cookie"] as string;

    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("HttpOnly");
  });

  it("should set Secure flag on refresh token cookie", async () => {
    const res = await app.inject({ method: "GET", url: "/set-cookie" });
    const setCookie = res.headers["set-cookie"] as string;

    expect(setCookie).toContain("Secure");
  });

  it("should set SameSite=Strict on refresh token cookie", async () => {
    const res = await app.inject({ method: "GET", url: "/set-cookie" });
    const setCookie = res.headers["set-cookie"] as string;

    expect(setCookie).toContain("SameSite=Strict");
  });

  it("should restrict cookie path to /v1/auth", async () => {
    const res = await app.inject({ method: "GET", url: "/set-cookie" });
    const setCookie = res.headers["set-cookie"] as string;

    expect(setCookie).toContain("Path=/v1/auth");
  });

  it("should use 'jaanify_refresh' as cookie name", async () => {
    const res = await app.inject({ method: "GET", url: "/set-cookie" });
    const setCookie = res.headers["set-cookie"] as string;

    expect(setCookie).toContain("jaanify_refresh=");
  });

  // ── NEGATIVE: Access token not in cookies ──

  it("should NOT set access token in any cookie", async () => {
    const res = await app.inject({ method: "GET", url: "/get-tokens" });
    const setCookie = res.headers["set-cookie"] as string;

    // Only the refresh cookie should be set
    expect(setCookie).toContain("jaanify_refresh=");
    expect(setCookie).not.toContain("access_token");
    expect(setCookie).not.toContain("jaanify_access");

    // Access token should be in the response body
    const body = JSON.parse(res.body);
    expect(body.access_token).toBe("access-token-456");
  });

  // ── BOUNDARY: Clear cookie ──

  it("should clear refresh token cookie on logout", async () => {
    const res = await app.inject({ method: "GET", url: "/clear-cookie" });
    const setCookie = res.headers["set-cookie"] as string;

    expect(setCookie).toBeDefined();
    // Clear cookie sets Max-Age=0 or Expires in the past
    expect(
      setCookie.includes("Max-Age=0") ||
        setCookie.includes("Expires=Thu, 01 Jan 1970"),
    ).toBe(true);
  });

  // ── ATTACK REPLAY: XSS cannot access httpOnly cookie ──

  it("should prevent JavaScript access to refresh token (httpOnly)", async () => {
    const res = await app.inject({ method: "GET", url: "/set-cookie" });
    const setCookie = res.headers["set-cookie"] as string;

    // httpOnly means document.cookie cannot read this cookie
    // This test verifies the flag is present (actual JS isolation is enforced by browser)
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).not.toContain("HttpOnly=false");
  });
});
