/**
 * Backend Scaffold: Login/Auth Cookie Migration
 * PRD-02 | 2026-02-20 | Cycle 13
 *
 * This file contains the DIFF-STYLE scaffold for all backend changes
 * needed to migrate from JSON-body tokens to HttpOnly cookie tokens.
 *
 * Each section corresponds to a task from the task breakdown.
 * Sections are labeled with the file path and task ID.
 */

// ============================================================================
// T-01: apps/api/src/lib/secure-cookies.ts
// ADD access token cookie helpers + convenience wrappers
// ============================================================================

import type { FastifyReply } from "fastify";
import type { AuthTokens } from "./auth-tokens.js";

// --- Existing code (keep as-is) ---
// setRefreshTokenCookie() and clearRefreshTokenCookie() remain unchanged.
// Only additions below.

// --- NEW: Cookie name constants (export for use in auth plugin T-09) ---

export const ACCESS_COOKIE_NAME = "jaanify_access";
export const REFRESH_COOKIE_NAME = "jaanify_refresh";

// --- NEW: Access token cookie ---

export interface AccessCookieOptions {
  /** Cookie name. Default: "jaanify_access" */
  name?: string;
  /** Cookie max-age in seconds. Default: 900 (15 minutes) */
  maxAge?: number;
  /** Cookie domain. Default: undefined (current host) */
  domain?: string;
  /** Cookie path. Default: "/" (sent on all requests for middleware check) */
  path?: string;
}

const ACCESS_DEFAULTS: Required<AccessCookieOptions> = {
  name: ACCESS_COOKIE_NAME,
  maxAge: 900, // 15 minutes — matches ACCESS_TOKEN_TTL
  domain: "",
  path: "/",
};

/**
 * Set the access token as an HttpOnly Secure SameSite=Lax cookie.
 *
 * SameSite=Lax allows the cookie to be sent on top-level navigations
 * (GET requests), which is needed for Next.js middleware to check
 * session existence on page load.
 */
export function setAccessTokenCookie(
  reply: FastifyReply,
  accessToken: string,
  options?: AccessCookieOptions,
): void {
  const opts = { ...ACCESS_DEFAULTS, ...options };

  reply.setCookie(opts.name, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax", // Lax for navigation-based session checks
    maxAge: opts.maxAge,
    path: opts.path,
    ...(opts.domain ? { domain: opts.domain } : {}),
  });
}

/**
 * Clear the access token cookie.
 */
export function clearAccessTokenCookie(
  reply: FastifyReply,
  options?: AccessCookieOptions,
): void {
  const opts = { ...ACCESS_DEFAULTS, ...options };

  reply.clearCookie(opts.name, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: opts.path,
    ...(opts.domain ? { domain: opts.domain } : {}),
  });
}

// --- NEW: Convenience wrappers ---

/**
 * Set both access and refresh token cookies.
 * Call this after generating a token pair in any auth route.
 */
export function setAuthCookies(
  reply: FastifyReply,
  tokens: AuthTokens,
): void {
  setAccessTokenCookie(reply, tokens.access_token);
  setRefreshTokenCookie(reply, tokens.refresh_token);
}

/**
 * Clear both auth cookies. Call this during logout.
 */
export function clearAuthCookies(reply: FastifyReply): void {
  clearAccessTokenCookie(reply);
  clearRefreshTokenCookie(reply);
}

// NOTE: Keep the existing setRefreshTokenCookie / clearRefreshTokenCookie
// functions. Update the DEFAULTS.name to use REFRESH_COOKIE_NAME constant:
//   const DEFAULTS = { name: REFRESH_COOKIE_NAME, ... }


// ============================================================================
// T-06: apps/api/src/routes/auth/auth.schema.ts
// ADD authResponseSchema (body response without refresh_token)
// ============================================================================

import { z } from "zod";

// --- Existing (keep as-is for internal use) ---
// export const authTokensSchema = z.object({ ... });

// --- NEW: Response schema for route handlers (no refresh_token in body) ---

export const authResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("Bearer"),
  expires_in: z.number().int(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;


// ============================================================================
// T-02 + T-03 + T-04 + T-05: apps/api/src/routes/auth/index.ts
// UPDATE all auth routes to use cookies
// ============================================================================

import type { FastifyInstance } from "fastify";
import {
  googleAuthRequestSchema,
  authResponseSchema as authResponseSchemaImport,
  registerRequestSchema,
} from "./auth.schema.js";
import * as authService from "./auth.service.js";
import { setAuthCookies, clearAuthCookies } from "../../lib/secure-cookies.js";
import { getRefreshToken } from "../../lib/cookie-helpers.js";

export async function authRoutes(fastify: FastifyInstance) {

  // --- T-02: POST /auth/google — Set cookies on Google login ---
  fastify.post("/auth/google", {
    schema: {
      body: googleAuthRequestSchema,
      response: { 200: authResponseSchemaImport },
    },
    handler: async (request, reply) => {
      const tokens = await authService.googleAuth(request.body as any);

      // NEW: Set HttpOnly cookies
      setAuthCookies(reply, tokens);

      // Return access_token in body (for frontend in-memory store)
      // Do NOT return refresh_token in body
      return reply.status(200).send({
        access_token: tokens.access_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
      });
    },
  });

  // --- T-03: POST /auth/refresh — Read cookie, set new cookies ---
  fastify.post("/auth/refresh", {
    schema: {
      response: { 200: authResponseSchemaImport },
    },
    handler: async (request, reply) => {
      const body = request.body as { refresh_token?: string } | undefined;

      // NEW: Read refresh token from cookie first, body fallback
      const refreshToken = getRefreshToken(request, body?.refresh_token);

      if (!refreshToken) {
        return reply
          .status(401)
          .header("Content-Type", "application/problem+json")
          .send({
            type: "https://api.jaanify.com/errors/authentication-required",
            status: 401,
            title: "Missing Refresh Token",
            detail:
              "No refresh token found in cookie or request body.",
            instance: request.url,
          });
      }

      const tokens = await authService.refreshToken(refreshToken);

      // NEW: Set fresh cookies
      setAuthCookies(reply, tokens);

      return reply.status(200).send({
        access_token: tokens.access_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
      });
    },
  });

  // --- T-04: POST /auth/register — Set cookies on registration ---
  fastify.post("/auth/register", {
    schema: {
      body: registerRequestSchema,
      response: { 200: authResponseSchemaImport },
    },
    handler: async (request, reply) => {
      const tokens = await authService.register(request.body as any);

      // NEW: Set HttpOnly cookies
      setAuthCookies(reply, tokens);

      return reply.status(200).send({
        access_token: tokens.access_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
      });
    },
  });

  // --- T-05: DELETE /auth/logout — Clear cookies ---
  fastify.delete("/auth/logout", {
    handler: async (request, reply) => {
      await authService.logout(request.userId);

      // NEW: Clear HttpOnly cookies (client can't do this via JS)
      clearAuthCookies(reply);

      return reply.status(204).send();
    },
  });
}


// ============================================================================
// T-09: apps/api/src/plugins/auth.ts
// UPDATE auth plugin to also read access token from cookie
// ============================================================================

import type { FastifyInstance as FI, FastifyRequest as FR, FastifyReply as FRe } from "fastify";
import fp from "fastify-plugin";
import * as jose from "jose";
import { verifyAccessToken } from "../lib/auth-tokens.js";
import { ACCESS_COOKIE_NAME } from "../lib/secure-cookies.js";

// (declare module "fastify" block stays the same)

const PUBLIC_PATHS = [
  "/v1/auth/google",
  "/v1/auth/refresh",
  "/v1/auth/register",
  "/v1/guest-sessions",
  "/v1/health",
  "/docs",
  "/documentation",
];

async function authPluginFn(fastify: FI) {
  fastify.decorateRequest("userId", "");
  fastify.decorateRequest("jwtPayload", null as unknown as jose.JWTPayload);

  fastify.addHook(
    "onRequest",
    async (request: FR, reply: FRe) => {
      const isPublicPath = PUBLIC_PATHS.some((path) =>
        request.url.startsWith(path),
      );
      if (isPublicPath) return;
      if (request.routeOptions.config?.public === true) return;

      // --- CHANGED: Extract token from header OR cookie ---
      let token: string | undefined;

      // Priority 1: Authorization header (API clients, mobile apps)
      const authHeader = request.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }

      // Priority 2: Access token cookie (browser with HttpOnly cookies)
      if (!token) {
        token = request.cookies?.[ACCESS_COOKIE_NAME];
      }

      // No token found in either location
      if (!token) {
        return reply
          .status(401)
          .header("Content-Type", "application/problem+json")
          .send({
            type: "https://api.jaanify.com/errors/authentication-required",
            status: 401,
            title: "Authentication Required",
            detail:
              "Missing access token. Provide via Authorization header or cookie.",
            instance: request.url,
          });
      }

      try {
        const payload = await verifyAccessToken(token);

        if (!payload.sub) {
          return reply
            .status(401)
            .header("Content-Type", "application/problem+json")
            .send({
              type: "https://api.jaanify.com/errors/authentication-required",
              status: 401,
              title: "Invalid Token",
              detail: "Access token is missing required 'sub' claim.",
              instance: request.url,
            });
        }

        request.userId = payload.sub;
        request.jwtPayload = payload;
      } catch (error: unknown) {
        if (error instanceof jose.errors.JWTExpired) {
          return reply
            .status(401)
            .header("Content-Type", "application/problem+json")
            .send({
              type: "https://api.jaanify.com/errors/token-expired",
              status: 401,
              title: "Token Expired",
              detail:
                "Access token has expired. Use /v1/auth/refresh to obtain a new token.",
              instance: request.url,
            });
        }

        request.log.warn({ err: error }, "JWT verification failed");

        return reply
          .status(401)
          .header("Content-Type", "application/problem+json")
          .send({
            type: "https://api.jaanify.com/errors/authentication-required",
            status: 401,
            title: "Invalid Token",
            detail: "The provided access token is invalid or malformed.",
            instance: request.url,
          });
      }
    },
  );
}

export const authPlugin_scaffold = fp(authPluginFn, {
  name: "auth",
  fastify: "5.x",
});


// ============================================================================
// T-07: apps/api/src/app.ts
// VERIFY CORS configuration (no code change needed)
// ============================================================================

// Current code is correct:
//   await app.register(cors, { origin: env.CORS_ORIGIN, credentials: true });
//
// CORS_ORIGIN defaults to "http://localhost:3001" which is a specific origin.
// credentials: true is already set.
//
// IMPORTANT: Ensure CORS_ORIGIN is NEVER set to "*" in production.
// The browser rejects Set-Cookie when Access-Control-Allow-Origin is "*"
// and Access-Control-Allow-Credentials is "true".
//
// For production, set CORS_ORIGIN to the actual frontend domain:
//   CORS_ORIGIN=https://app.jaanify.com


// ============================================================================
// T-08 (OPTIONAL): GET /auth/google/callback — Backend redirect flow
// ============================================================================

// This is an OPTIONAL alternative to the current frontend code-exchange flow.
// Only implement if the team decides on backend-redirect OAuth flow.

/*
fastify.get("/auth/google/callback", {
  config: { public: true },
  handler: async (request, reply) => {
    const { code, state } = request.query as { code: string; state?: string };

    if (!code) {
      return reply.status(400).send({ error: "Missing authorization code" });
    }

    // Parse state to get redirect URL (set by frontend when initiating OAuth)
    const env = validateEnv();
    let redirectTo = `${env.CORS_ORIGIN}/dashboard`;

    if (state) {
      try {
        const parsed = JSON.parse(Buffer.from(state, "base64url").toString());
        // Validate redirect URL is same-origin to prevent open redirect
        if (
          typeof parsed.redirect === "string" &&
          parsed.redirect.startsWith("/")
        ) {
          redirectTo = `${env.CORS_ORIGIN}${parsed.redirect}`;
        }
      } catch {
        // Invalid state, use default redirect
      }
    }

    const tokens = await authService.googleAuth({
      code,
      redirect_uri: `${env.CORS_ORIGIN}/auth/callback`,
    });

    setAuthCookies(reply, tokens);

    return reply.redirect(302, redirectTo);
  },
});
*/
