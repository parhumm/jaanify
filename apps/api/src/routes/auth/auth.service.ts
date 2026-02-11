import { prisma } from "../../lib/prisma.js";
import type { GoogleAuthRequest, RegisterRequest, AuthTokens } from "./auth.schema.js";

export async function googleAuth(data: GoogleAuthRequest): Promise<AuthTokens> {
  // TODO: Exchange code with Google OAuth2 API
  // TODO: Find or create user
  // TODO: Generate JWT token pair
  throw new Error("Not implemented");
}

export async function refreshToken(): Promise<AuthTokens> {
  // TODO: Validate refresh token, generate new token pair
  throw new Error("Not implemented");
}

export async function register(data: RegisterRequest): Promise<AuthTokens> {
  // TODO: Convert guest session to registered user
  throw new Error("Not implemented");
}

export async function logout(userId: string): Promise<void> {
  // TODO: Invalidate refresh token
}
