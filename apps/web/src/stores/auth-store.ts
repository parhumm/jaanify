import { create } from "zustand";
import { apiClient } from "@/lib/api-client";
import type { UserResponse } from "@/types/api";

/**
 * Zustand Auth Store
 *
 * Manages authentication state for the Jaanify frontend.
 * - user: the current user object (null if not authenticated)
 * - isAuthenticated: derived from user presence
 * - isLoading: true while hydrating session from /users/me
 * - hydrate(): call on app mount to check if user has a valid session
 * - logout(): call DELETE /auth/logout, clear state, redirect to /
 */

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  setUser: (user: UserResponse) => void;
  logout: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  hydrate: async () => {
    // Avoid re-hydrating if already authenticated
    if (get().isAuthenticated && get().user) {
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      const { data } = await apiClient.get<UserResponse>("/users/me");
      set({
        user: data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      // No valid session — user is not authenticated
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setUser: (user: UserResponse) => {
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await apiClient.delete("/auth/logout");
    } catch {
      // Even if the API call fails, clear local state
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Redirect to landing page
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  },

  reset: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
