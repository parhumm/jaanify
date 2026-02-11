import { decodeJwt } from "jose";
import { prisma } from "../../lib/prisma.js";
import { BusinessError } from "../../lib/error-factory.js";
import { generateTokenPair, verifyRefreshToken } from "../../lib/auth-tokens.js";
import { validateEnv } from "../../lib/env.js";
import type { z } from "zod";
import type {
  googleAuthRequestSchema,
  registerRequestSchema,
} from "./auth.schema.js";
import type { AuthTokens } from "./auth.schema.js";

type GoogleAuthRequest = z.infer<typeof googleAuthRequestSchema>;
type RegisterRequest = z.infer<typeof registerRequestSchema>;

/* ------------------------------------------------------------------ */
/*  Internal: Google OAuth2 token exchange                            */
/* ------------------------------------------------------------------ */

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
}

/**
 * Exchange a Google authorization code for tokens and decode the
 * id_token to extract user profile information.
 */
async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
): Promise<GoogleUserInfo> {
  const env = validateEnv();

  const body = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new BusinessError(
      "external-service-error",
      `Google token exchange failed (${response.status}): ${errorBody}`,
    );
  }

  const tokenData: unknown = await response.json();
  const idToken = (tokenData as Record<string, unknown>)["id_token"];

  if (typeof idToken !== "string") {
    throw new BusinessError(
      "external-service-error",
      "Google token response did not include an id_token",
    );
  }

  const claims = decodeJwt(idToken);

  const email = claims["email"];
  const name = claims["name"];
  const picture = claims["picture"];

  if (typeof email !== "string" || email.length === 0) {
    throw new BusinessError(
      "validation-error",
      "Google id_token is missing a valid email claim",
    );
  }

  return {
    email,
    name: typeof name === "string" ? name : "",
    picture: typeof picture === "string" ? picture : "",
  };
}

/* ------------------------------------------------------------------ */
/*  1. googleAuth                                                     */
/* ------------------------------------------------------------------ */

/**
 * Authenticate (or register) a user via Google OAuth2.
 *
 * - Exchanges the authorization code for an id_token
 * - Upserts the user by email
 * - Re-activates soft-deleted accounts
 * - Returns a JWT access + refresh token pair
 */
export async function googleAuth(data: GoogleAuthRequest): Promise<AuthTokens> {
  const { code, redirect_uri } = data;
  const googleUser = await exchangeGoogleCode(code, redirect_uri);

  // Upsert: find existing user by email, or create a new one
  const existingUser = await prisma.user.findUnique({
    where: { email: googleUser.email },
  });

  let user;

  if (existingUser) {
    // Re-activate soft-deleted user + update profile fields
    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: googleUser.name,
        avatarUrl: googleUser.picture,
        authProvider: "google",
        // Clear soft-delete flag if present
        deletedAt: null,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.picture,
        authProvider: "google",
      },
    });
  }

  const tokens = await generateTokenPair({
    sub: user.id,
    email: user.email,
  });

  return tokens;
}

/* ------------------------------------------------------------------ */
/*  2. refreshToken                                                   */
/* ------------------------------------------------------------------ */

/**
 * Issue a fresh token pair from a valid refresh token.
 *
 * - Verifies the refresh token cryptographically
 * - Ensures the user still exists and is not soft-deleted
 * - Returns a new access + refresh token pair
 */
export async function refreshToken(
  currentRefreshToken: string,
): Promise<AuthTokens> {
  const payload = await verifyRefreshToken(currentRefreshToken).catch(() => {
    throw new BusinessError("unauthorized", "Invalid or expired refresh token");
  });

  const userId = payload.sub;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new BusinessError("not-found", "User not found");
  }

  if (user.deletedAt !== null) {
    throw new BusinessError(
      "unauthorized",
      "Account has been deactivated",
    );
  }

  const tokens = await generateTokenPair({
    sub: user.id,
    email: user.email,
  });

  return tokens;
}

/* ------------------------------------------------------------------ */
/*  3. register                                                       */
/* ------------------------------------------------------------------ */

/**
 * Guest task data stored in GuestSession.dataJson.
 * Each entry mirrors the minimal fields needed to create a Task.
 */
interface GuestTask {
  title: string;
  raw_input?: string;
  description?: string;
  deadline?: string;
  category?: string;
  energy_level?: string;
  estimated_minutes?: number;
}

/**
 * Convert a guest session into a registered user account.
 *
 * Runs inside an interactive Prisma transaction to guarantee atomicity:
 * 1. Validate the guest session
 * 2. Exchange the OAuth code for user info
 * 3. Create the user
 * 4. Migrate guest tasks to the new user
 * 5. Delete the guest session
 * 6. Return a token pair
 */
export async function register(data: RegisterRequest): Promise<AuthTokens> {
  const { anonymous_id, provider, code } = data;

  // Exchange OAuth code outside the transaction (network call)
  // For MVP we only support Google; future providers would branch here.
  if (provider !== "google") {
    throw new BusinessError(
      "validation-error",
      `Unsupported auth provider: ${provider}`,
    );
  }

  // We need a redirect_uri for Google. During registration from a guest
  // session the client must send it as part of the code exchange.
  // For register flow, we use a well-known redirect URI.
  // The client is expected to use the same redirect_uri it used when
  // initiating the OAuth flow. Since the schema doesn't carry it,
  // we derive it from the CORS_ORIGIN (the frontend URL).
  const env = validateEnv();
  const redirectUri = `${env.CORS_ORIGIN}/auth/callback`;

  const googleUser = await exchangeGoogleCode(code, redirectUri);

  const tokens = await prisma.$transaction(async (tx) => {
    // 1. Find and validate the guest session
    const session = await tx.guestSession.findUnique({
      where: { anonymousId: anonymous_id },
    });

    if (!session) {
      throw new BusinessError("not-found", "Guest session not found");
    }

    if (session.expiresAt < new Date()) {
      throw new BusinessError("not-found", "Guest session has expired");
    }

    // 2. Create the new user
    const user = await tx.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.picture,
        authProvider: provider,
      },
    });

    // 3. Migrate guest tasks from data_json
    const dataJson = session.dataJson as Record<string, unknown> | null;
    const guestTasks: GuestTask[] = Array.isArray(dataJson?.["tasks"])
      ? (dataJson["tasks"] as GuestTask[])
      : [];

    if (guestTasks.length > 0) {
      await tx.task.createMany({
        data: guestTasks.map((task) => ({
          userId: user.id,
          title: task.title,
          rawInput: task.raw_input ?? null,
          description: task.description ?? null,
          deadline: task.deadline ? new Date(task.deadline) : null,
          category: task.category ?? null,
          energyLevel: task.energy_level ?? null,
          estimatedMinutes: task.estimated_minutes ?? null,
        })),
      });
    }

    // 4. Delete the guest session
    await tx.guestSession.delete({
      where: { id: session.id },
    });

    // 5. Generate token pair for the newly created user
    return generateTokenPair({
      sub: user.id,
      email: user.email,
    });
  });

  return tokens;
}

/* ------------------------------------------------------------------ */
/*  4. logout                                                         */
/* ------------------------------------------------------------------ */

/**
 * Log the user out.
 *
 * For MVP, JWTs are stateless so there is no server-side state to
 * invalidate. The client is responsible for clearing stored tokens.
 * In a future iteration this would add the refresh token to a
 * deny-list (e.g. Redis) or delete it from a sessions table.
 */
export async function logout(_userId: string): Promise<void> {
  // Intentional no-op for MVP — stateless JWT strategy.
  // Client-side token removal is sufficient.
}
