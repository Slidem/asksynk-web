import { create } from "zustand";

interface TimerSoundSettingsState {
  enabled: boolean;
  volume: number;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useTimerSoundSettingsStore = create<TimerSoundSettingsState>(
  (set) => ({
    enabled: true,
    volume: 0.7,
    setEnabled: (enabled) => set({ enabled }),
    setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
  }),
);
