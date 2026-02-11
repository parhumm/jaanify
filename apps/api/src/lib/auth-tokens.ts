import * as jose from 'jose';
import { randomUUID } from 'node:crypto';
import { env } from './env.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Claims embedded in the access token. */
interface TokenPayload {
  /** User ID (maps to JWT `sub` claim). */
  sub: string;
  email?: string;
  role?: string;
}

/** The pair of tokens returned after authentication. */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  /** Access token lifetime in seconds. */
  expires_in: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ISSUER = 'jaanify';
const AUDIENCE = 'jaanify-api';
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';
/** 15 minutes expressed in seconds — matches ACCESS_TOKEN_TTL. */
const ACCESS_TOKEN_TTL_SECONDS = 900;
/** Tolerate up to 30 seconds of clock skew when verifying tokens. */
const CLOCK_TOLERANCE = 30;

// ---------------------------------------------------------------------------
// Token generation
// ---------------------------------------------------------------------------

/**
 * Generate a short-lived access token (HS256, 15 min).
 *
 * The token includes the user's email and role as custom claims, a unique
 * `jti` for revocation support, and standard `iss` / `aud` claims.
 */
export async function generateAccessToken(payload: TokenPayload): Promise<string> {
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  return new jose.SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .setJti(randomUUID())
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .sign(secret);
}

/**
 * Generate a long-lived refresh token (HS256, 7 days).
 *
 * Refresh tokens carry only the `sub` claim — no email/role so they cannot
 * be used as access tokens even if leaked.
 */
export async function generateRefreshToken(payload: TokenPayload): Promise<string> {
  const secret = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET);

  return new jose.SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .setJti(randomUUID())
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .sign(secret);
}

// ---------------------------------------------------------------------------
// Token verification
// ---------------------------------------------------------------------------

/**
 * Verify and decode an access token.
 *
 * @throws {jose.errors.JWTExpired} when the token has expired.
 * @throws {jose.errors.JWTClaimValidationFailed} on issuer/audience mismatch.
 */
export async function verifyAccessToken(token: string): Promise<jose.JWTPayload> {
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  const { payload } = await jose.jwtVerify(token, secret, {
    issuer: ISSUER,
    audience: AUDIENCE,
    clockTolerance: CLOCK_TOLERANCE,
  });

  return payload;
}

/**
 * Verify and decode a refresh token.
 *
 * @throws {jose.errors.JWTExpired} when the token has expired.
 * @throws {jose.errors.JWTClaimValidationFailed} on issuer/audience mismatch.
 */
export async function verifyRefreshToken(token: string): Promise<jose.JWTPayload> {
  const secret = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET);

  const { payload } = await jose.jwtVerify(token, secret, {
    issuer: ISSUER,
    audience: AUDIENCE,
    clockTolerance: CLOCK_TOLERANCE,
  });

  return payload;
}

// ---------------------------------------------------------------------------
// Convenience: generate both tokens at once
// ---------------------------------------------------------------------------

/**
 * Issue an access + refresh token pair in parallel.
 *
 * Returns a response-ready object that can be sent directly to the client.
 */
export async function generateTokenPair(payload: TokenPayload): Promise<AuthTokens> {
  const [access_token, refresh_token] = await Promise.all([
    generateAccessToken(payload),
    generateRefreshToken(payload),
  ]);

  return {
    access_token,
    refresh_token,
    token_type: 'Bearer',
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
  };
}
