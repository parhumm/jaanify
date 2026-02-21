import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import * as jose from "jose";
import { verifyAccessToken } from "../lib/auth-tokens.js";
import { ACCESS_COOKIE_NAME } from "../lib/secure-cookies.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    jwtPayload: jose.JWTPayload;
  }
  interface FastifyContextConfig {
    public?: boolean;
  }
}

const PUBLIC_PATHS = [
  "/v1/auth/google",
  "/v1/auth/refresh",
  "/v1/auth/register",
  "/v1/guest-sessions",
  "/v1/health",
  "/docs",
  "/documentation",
];

async function authPluginFn(fastify: FastifyInstance) {
  fastify.decorateRequest("userId", "");
  fastify.decorateRequest("jwtPayload", null as unknown as jose.JWTPayload);

  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Allow public paths without authentication
      const isPublicPath = PUBLIC_PATHS.some((path) =>
        request.url.startsWith(path),
      );
      if (isPublicPath) return;

      // Allow routes explicitly marked as public via route config
      if (request.routeOptions.config?.public === true) return;

      // Extract token from header OR cookie
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
              detail:
                "Access token is missing required 'sub' claim.",
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

        // All other jose errors (JWTClaimValidationFailed, JWTInvalid, JWSSignatureVerificationFailed, etc.)
        request.log.warn(
          { err: error },
          "JWT verification failed",
        );

        return reply
          .status(401)
          .header("Content-Type", "application/problem+json")
          .send({
            type: "https://api.jaanify.com/errors/authentication-required",
            status: 401,
            title: "Invalid Token",
            detail:
              "The provided access token is invalid or malformed.",
            instance: request.url,
          });
      }
    },
  );
}

export const authPlugin = fp(authPluginFn, {
  name: "auth",
  fastify: "5.x",
});
