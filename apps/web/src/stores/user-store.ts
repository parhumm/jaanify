import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPreferences {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  hasCompletedOnboarding: boolean;
  setOnboardingComplete: () => void;
}

export const useUserStore = create<UserPreferences>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      hasCompletedOnboarding: false,
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
    }),
    { name: "jaanify-user-prefs" }
  )
);
