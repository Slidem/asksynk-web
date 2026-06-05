import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FloatingTimerHiddenState {
  /** Persisted: timer minimized to the sidebar. */
  hidden: boolean;
  /** Transient: one-shot tooltip shown right after minimizing. */
  showHint: boolean;
  hide: () => void;
  show: () => void;
  dismissHint: () => void;
}

export const useFloatingTimerHiddenStore = create<FloatingTimerHiddenState>()(
  persist(
    (set) => ({
      hidden: false,
      showHint: false,
      hide: () => set({ hidden: true, showHint: true }),
      show: () => set({ hidden: false, showHint: false }),
      dismissHint: () => set({ showHint: false }),
    }),
    {
      name: "asksynk:floating-timer-hidden",
      partialize: (s) => ({ hidden: s.hidden }),
    },
  ),
);
