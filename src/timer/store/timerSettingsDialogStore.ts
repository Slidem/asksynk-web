import { create } from "zustand";

interface TimerSettingsDialogState {
  opened: boolean;
  open: () => void;
  close: () => void;
}

export const useTimerSettingsDialogStore = create<TimerSettingsDialogState>(
  (set) => ({
    opened: false,
    open: () => set({ opened: true }),
    close: () => set({ opened: false }),
  }),
);
