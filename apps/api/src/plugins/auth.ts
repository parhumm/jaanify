import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

interface JwtPayload {
  sub: string;
  email: string | null;
  iat: number;
  exp: number;
}

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    jwtPayload: JwtPayload;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest("userId", "");
  fastify.decorateRequest("jwtPayload", null);

  fastify.addHook("onRequest", async (request: FastifyRequest, reply: FastifyReply) => {
    const publicPaths = [
      "/v1/auth/google",
      "/v1/auth/refresh",
      "/v1/auth/register",
      "/v1/guest-sessions",
      "/v1/health",
    ];

    const isPublic = publicPaths.some(
      (path) =>
        request.url === path ||
        request.url.startsWith("/v1/guest-sessions/") ||
        request.url.startsWith("/docs")
    );

    if (isPublic) return;

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({
        type: "https://api.jaanify.com/errors/unauthorized",
        status: 401,
        title: "Unauthorized",
        detail: "Missing or invalid Authorization header. Expected: Bearer <token>",
      });
    }

    const token = authHeader.slice(7);

    try {
      // TODO: Replace with jose JWT verification (sec-audit-remediate will fix this)
      const payload = decodeJwt(token);
      if (!payload || !payload.sub) {
        throw new Error("Invalid token payload");
      }

      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return reply.status(401).send({
          type: "https://api.jaanify.com/errors/token-expired",
          status: 401,
          title: "Token Expired",
          detail: "Access token has expired. Use /auth/refresh to obtain a new token.",
        });
      }

      request.userId = payload.sub;
      request.jwtPayload = payload;
    } catch {
      return reply.status(401).send({
        type: "https://api.jaanify.com/errors/invalid-token",
        status: 401,
        title: "Invalid Token",
        detail: "The provided access token is invalid or malformed.",
      });
    }
  });
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1]!, "base64url").toString());
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export const authMiddleware = fp(authPlugin, {
  name: "auth",
  fastify: "5.x",
});
