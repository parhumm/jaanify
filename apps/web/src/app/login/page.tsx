"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/auth-store";

/**
 * /login route — Jaanify Login Page
 *
 * ADHD-friendly: minimal elements, one clear action, no distractions.
 * Primary CTA: "Continue with Google"
 * Secondary: "Try without account" → /onboarding
 * Supports ?redirect= param for post-auth navigation.
 */

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const GOOGLE_REDIRECT_URI =
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "http://localhost:3001/login/callback";

function getGoogleOAuthUrl(redirect: string) {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state: redirect,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  const redirect = searchParams.get("redirect") ?? "/dashboard";

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace(redirect);
    }
  }, [isAuthenticated, isLoading, redirect, router]);

  function handleGoogleLogin() {
    window.location.href = getGoogleOAuthUrl(redirect);
  }

  // Show nothing while checking auth state to avoid flash
  if (isLoading) {
    return (
      <main className="min-h-screen bg-(--color-bg) flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-(--color-sage) border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--color-bg) text-(--color-text) flex flex-col">
      {/* Minimal nav with just the logo */}
      <nav className="px-6 py-4">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-(--color-sage-dark) hover:text-(--color-sage) transition-colors"
        >
          Jaanify
        </a>
      </nav>

      {/* Centered login card */}
      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          {/* Branding */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="text-(--color-sage)">Jaanify</span>
            </h1>
            <p className="mt-3 text-(--color-text)/60">
              Sign in to access your tasks and daily plans.
            </p>
          </div>

          {/* Google OAuth button — primary CTA */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className={cn(
              "w-full flex items-center justify-center gap-3",
              "px-6 py-4 rounded-xl text-base font-semibold",
              "bg-white text-gray-700 border border-gray-300",
              "hover:bg-gray-50 hover:border-gray-400",
              "active:scale-[0.98]",
              "transition-all duration-150 ease-out",
              "shadow-sm hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2"
            )}
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-(--color-sage-light)/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-(--color-bg) px-4 text-(--color-text)/40">
                or
              </span>
            </div>
          </div>

          {/* Guest / skip option */}
          <a
            href="/onboarding"
            className={cn(
              "w-full flex items-center justify-center",
              "px-6 py-3 rounded-xl text-sm font-medium",
              "text-(--color-text)/60",
              "hover:text-(--color-text) hover:bg-(--color-cream-dark)",
              "transition-all duration-150 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-sage) focus-visible:ring-offset-2"
            )}
          >
            Try without account
          </a>

          {/* Fine print */}
          <p className="mt-10 text-center text-xs text-(--color-text)/40 leading-relaxed">
            By continuing, you agree to Jaanify&apos;s Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
