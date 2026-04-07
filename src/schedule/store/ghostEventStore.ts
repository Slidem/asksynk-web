import { create } from "zustand";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";

type GhostEventState = {
  ghostEvent: CalendarEvent | null;
  setGhostEvent: (event: CalendarEvent) => void;
  clearGhostEvent: () => void;
};

export const useGhostEventStore = create<GhostEventState>((set) => ({
  ghostEvent: null,
  setGhostEvent: (event) => set({ ghostEvent: event }),
  clearGhostEvent: () => set({ ghostEvent: null }),
}));
