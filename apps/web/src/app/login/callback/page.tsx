"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";

const GOOGLE_REDIRECT_URI =
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "http://localhost:3001/login/callback";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuthStore();
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state") ?? "/dashboard";
    const error = searchParams.get("error");

    if (error || !code) {
      router.replace(`/login?error=${error ?? "missing_code"}`);
      return;
    }

    apiClient
      .post("/auth/google", { code, redirect_uri: GOOGLE_REDIRECT_URI })
      .then(async () => {
        // Cookies are set by the backend via Set-Cookie headers.
        // Hydrate the auth store from /users/me to populate user data.
        const { data } = await apiClient.get("/users/me");
        setUser(data);
        router.replace(state);
      })
      .catch(() => {
        router.replace("/login?error=auth_failed");
      });
  }, [searchParams, router, setUser]);

  return (
    <main className="min-h-screen bg-(--color-bg) flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 mx-auto rounded-full border-2 border-(--color-sage) border-t-transparent animate-spin" />
        <p className="mt-4 text-sm text-(--color-text)/60">Signing you in...</p>
      </div>
    </main>
  );
}

export default function LoginCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-(--color-bg) flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-(--color-sage) border-t-transparent animate-spin" />
        </main>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
