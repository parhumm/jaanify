import { create } from "zustand";
import type { TaskParseResponse } from "@/types/api";

interface OnboardingState {
  step: 1 | 2 | 3 | 4;
  setStep: (step: 1 | 2 | 3 | 4) => void;
  taskText: string;
  setTaskText: (text: string) => void;
  parsedTask: TaskParseResponse | null;
  setParsedTask: (task: TaskParseResponse | null) => void;
  guestAnonymousId: string | null;
  setGuestAnonymousId: (id: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  step: 1,
  setStep: (step) => set({ step }),
  taskText: "",
  setTaskText: (text) => set({ taskText: text }),
  parsedTask: null,
  setParsedTask: (task) => set({ parsedTask: task }),
  guestAnonymousId: null,
  setGuestAnonymousId: (id) => set({ guestAnonymousId: id }),
  reset: () =>
    set({
      step: 1,
      taskText: "",
      parsedTask: null,
      guestAnonymousId: null,
    }),
}));
