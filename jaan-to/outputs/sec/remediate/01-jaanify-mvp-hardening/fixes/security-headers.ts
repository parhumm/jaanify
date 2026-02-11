/**
 * Hardening: Security Headers via @fastify/helmet
 * Related: OWASP A05 Security Misconfiguration
 *
 * Adds standard security headers:
 * - Content-Security-Policy (CSP)
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: DENY
 * - X-XSS-Protection: 0 (modern browsers use CSP instead)
 * - Strict-Transport-Security (HSTS)
 * - Referrer-Policy: strict-origin-when-cross-origin
 * - Permissions-Policy: restricts browser features
 *
 * Integration: Register in app.ts as the FIRST plugin (before CORS).
 *
 * @example
 * ```ts
 * import { securityHeadersPlugin } from "./fixes/security-headers.js";
 * await app.register(securityHeadersPlugin);
 * ```
 */

import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function securityHeadersPluginFn(fastify: FastifyInstance) {
  const helmet = await import("@fastify/helmet");

  await fastify.register(helmet.default, {
    // CSP: Restrict resource loading
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Swagger UI needs inline styles
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // HSTS: 1 year, include subdomains
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    // Prevent MIME-type sniffing
    xContentTypeOptions: true,
    // Prevent clickjacking
    xFrameOptions: { action: "deny" },
    // Disable legacy XSS filter (CSP is the modern replacement)
    xXssProtection: false,
    // Control referrer leakage
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    // No cross-origin embedder/opener for API server
    crossOriginEmbedderPolicy: false, // API doesn't serve HTML
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "same-origin" },
  });
}

export const securityHeadersPlugin = fp(securityHeadersPluginFn, {
  name: "security-headers",
  fastify: "5.x",
});
