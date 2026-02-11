import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TaskUIState {
  expandedReasoningIds: Set<string>;
  toggleReasoning: (id: string) => void;
  preferredTier: 1 | 2 | 3;
  setPreferredTier: (tier: 1 | 2 | 3) => void;
}

export const useTaskStore = create<TaskUIState>()(
  persist(
    (set) => ({
      expandedReasoningIds: new Set(),
      toggleReasoning: (id) =>
        set((state) => {
          const next = new Set(state.expandedReasoningIds);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return { expandedReasoningIds: next };
        }),
      preferredTier: 1,
      setPreferredTier: (tier) => set({ preferredTier: tier }),
    }),
    {
      name: "jaanify-task-ui",
      partialize: (state) => ({ preferredTier: state.preferredTier }),
    }
  )
);
