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

// ── FRONTEND: In-memory token store pattern ──────────────────────────

/**
 * FRONTEND GUIDANCE (TypeScript/React pattern):
 *
 * Replace localStorage usage with an in-memory store:
 *
 * ```ts
 * // stores/auth-store.ts (Zustand)
 * import { create } from "zustand";
 *
 * interface AuthState {
 *   accessToken: string | null;
 *   setAccessToken: (token: string | null) => void;
 * }
 *
 * export const useAuthStore = create<AuthState>((set) => ({
 *   accessToken: null,
 *   setAccessToken: (token) => set({ accessToken: token }),
 * }));
 *
 * // api-client.ts — Axios interceptor
 * import axios from "axios";
 * import { useAuthStore } from "./stores/auth-store";
 *
 * const api = axios.create({ baseURL: "/api/v1", withCredentials: true });
 *
 * api.interceptors.request.use((config) => {
 *   const token = useAuthStore.getState().accessToken;
 *   if (token) config.headers.Authorization = `Bearer ${token}`;
 *   return config;
 * });
 *
 * // On 401, attempt silent refresh via httpOnly cookie:
 * api.interceptors.response.use(
 *   (res) => res,
 *   async (error) => {
 *     if (error.response?.status === 401 && !error.config._retry) {
 *       error.config._retry = true;
 *       const { data } = await axios.post("/api/v1/auth/refresh", {}, { withCredentials: true });
 *       useAuthStore.getState().setAccessToken(data.access_token);
 *       error.config.headers.Authorization = `Bearer ${data.access_token}`;
 *       return api(error.config);
 *     }
 *     return Promise.reject(error);
 *   }
 * );
 * ```
 *
 * KEY RULES:
 * - NEVER use localStorage.setItem("jaanify_access_token", ...)
 * - NEVER use localStorage.getItem("jaanify_access_token")
 * - Access token lives in Zustand store (or module-level variable)
 * - Refresh token lives in httpOnly cookie (set by backend)
 * - On page refresh, access token is null → silent refresh via cookie
 */
