import { create } from "zustand";

interface TimerRuntimeState {
  /** Wall-clock tick written by the engine; consumers derive remaining from completesAt. */
  nowMs: number;
  setNowMs: (nowMs: number) => void;
}

export const useTimerRuntimeStore = create<TimerRuntimeState>((set) => ({
  nowMs: Date.now(),
  setNowMs: (nowMs) => set({ nowMs }),
}));
