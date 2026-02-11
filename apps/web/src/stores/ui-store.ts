import { create } from "zustand";

interface UIState {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  featureFlags: {
    ENABLE_REASONING_CARDS: boolean;
    ENABLE_VOICE_INPUT: boolean;
    ENABLE_GUEST_MODE: boolean;
  };
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  featureFlags: {
    ENABLE_REASONING_CARDS: process.env.NEXT_PUBLIC_ENABLE_REASONING_CARDS !== "false",
    ENABLE_VOICE_INPUT: process.env.NEXT_PUBLIC_ENABLE_VOICE_INPUT !== "false",
    ENABLE_GUEST_MODE: process.env.NEXT_PUBLIC_ENABLE_GUEST_MODE !== "false",
  },
}));
