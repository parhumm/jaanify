/**
 * Fix: E-DEV-003 — Access Token Stored in localStorage
 * CWE-922: Insecure Storage of Sensitive Information
 *
 * Two-part fix:
 *
 * BACKEND: Set refresh token in httpOnly Secure SameSite cookie.
 * The access token is returned in the JSON response body and should
 * be stored ONLY in-memory (e.g. Zustand store, React state, or a
 * module-level variable). It is never persisted to localStorage or
 * sessionStorage.
 *
 * FRONTEND: Replace localStorage.getItem/setItem with in-memory store.
 * On page refresh, the access token is lost and must be re-obtained
 * via the /auth/refresh endpoint (which reads the httpOnly cookie).
 *
 * Integration:
 * - Backend: Call setRefreshTokenCookie() after generating tokens
 * - Frontend: Replace all localStorage token access with the pattern below
 */

// ── BACKEND: Cookie helpers ──────────────────────────────────────────

import type { FastifyReply } from "fastify";

export interface CookieOptions {
  /** Cookie name. Default: "jaanify_refresh" */
  name?: string;
  /** Cookie max-age in seconds. Default: 604800 (7 days) */
  maxAge?: number;
  /** Cookie domain. Default: undefined (current host) */
  domain?: string;
  /** Cookie path. Default: "/v1/auth" (only sent to auth endpoints) */
  path?: string;
}

const DEFAULTS: Required<CookieOptions> = {
  name: "jaanify_refresh",
  maxAge: 604800, // 7 days — matches REFRESH_TOKEN_TTL
  domain: "",
  path: "/v1/auth",
};

/**
 * Set the refresh token as an httpOnly Secure SameSite=Strict cookie.
 *
 * Call this in auth route handlers after generating tokens:
 * ```ts
 * setRefreshTokenCookie(reply, tokens.refresh_token);
 * return { access_token: tokens.access_token, token_type: "Bearer", expires_in: 900 };
 * ```
 */
export function setRefreshTokenCookie(
  reply: FastifyReply,
  refreshToken: string,
  options?: CookieOptions,
): void {
  const opts = { ...DEFAULTS, ...options };

  reply.setCookie(opts.name, refreshToken, {
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: "strict", // CSRF protection
    maxAge: opts.maxAge,
    path: opts.path,
    ...(opts.domain ? { domain: opts.domain } : {}),
  });
}

/**
 * Clear the refresh token cookie (used during logout).
 */
export function clearRefreshTokenCookie(
  reply: FastifyReply,
  options?: CookieOptions,
): void {
  const opts = { ...DEFAULTS, ...options };

  reply.clearCookie(opts.name, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: opts.path,
    ...(opts.domain ? { domain: opts.domain } : {}),
  });
}

// ── Access token cookie helpers ──────────────────────────────────────

import type { AuthTokens } from "./auth-tokens.js";

export const ACCESS_COOKIE_NAME = "jaanify_access";
export const REFRESH_COOKIE_NAME = "jaanify_refresh";

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
    sameSite: "lax",
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

// ── Convenience wrappers ────────────────────────────────────────────

/**
 * Set both access and refresh token cookies.
 * Call this after generating a token pair in any auth route.
 */
export function setAuthCookies(
  reply: FastifyReply,
  tokens: AuthTokens,
): void {
  setAccessTokenCookie(reply, tokens.access_token);
  setRefreshTokenCookie(reply, tokens.refresh_token!);
}

/**
 * Clear both auth cookies. Call this during logout.
 */
export function clearAuthCookies(reply: FastifyReply): void {
  clearAccessTokenCookie(reply);
  clearRefreshTokenCookie(reply);
}
