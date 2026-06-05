import { create } from "zustand";

interface FloatingTimerPositionState {
  /** null = default corner (CSS); set = dragged left/top in px. */
  x: number | null;
  y: number | null;
  setPosition: (x: number, y: number) => void;
}

export const useFloatingTimerPositionStore = create<FloatingTimerPositionState>(
  (set) => ({
    x: null,
    y: null,
    setPosition: (x, y) => set({ x, y }),
  }),
);
