/**
 * Fix: E-DEV-006 — @fastify/cookie Not Imported in Auth Route File
 * CWE-506: Missing Type Augmentation
 *
 * The @fastify/cookie plugin IS registered at app level, so runtime
 * works correctly. However, TypeScript may not recognize request.cookies
 * without proper type augmentation.
 *
 * This fix ensures the type augmentation is explicit. When @fastify/cookie
 * is installed and registered, its types should be auto-augmented via
 * the plugin's type declarations. If not, add this import to the
 * auth route file.
 *
 * Integration:
 * 1. Ensure @fastify/cookie is in devDependencies AND dependencies
 * 2. Add the import below to any route file that accesses request.cookies
 */

// This import ensures @fastify/cookie types are augmented on FastifyRequest.
// Place at the top of route files that access `request.cookies`.
import "@fastify/cookie";

/**
 * Type-safe cookie reader for refresh token.
 *
 * Usage in auth refresh route:
 * ```ts
 * import { getRefreshTokenFromCookie } from "./fixes/cookie-types.js";
 *
 * // In POST /auth/refresh handler:
 * const refreshToken = getRefreshTokenFromCookie(request);
 * if (!refreshToken) {
 *   return reply.status(401).send({
 *     type: "https://api.jaanify.com/errors/authentication-required",
 *     status: 401,
 *     title: "Missing Refresh Token",
 *     detail: "No refresh token found in cookie or request body.",
 *   });
 * }
 * ```
 */
import type { FastifyRequest } from "fastify";

const REFRESH_COOKIE_NAME = "jaanify_refresh";

export function getRefreshTokenFromCookie(
  request: FastifyRequest,
): string | undefined {
  return request.cookies?.[REFRESH_COOKIE_NAME];
}

/**
 * Extract refresh token from either cookie (preferred) or request body.
 * Cookie takes precedence for security (httpOnly, not accessible to JS).
 */
export function getRefreshToken(
  request: FastifyRequest,
  bodyToken?: string,
): string | undefined {
  return getRefreshTokenFromCookie(request) ?? bodyToken;
}
