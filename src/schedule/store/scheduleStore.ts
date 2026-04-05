import { create } from "zustand";

import type { CalendarEvent } from "@/schedule/models/event";
import { DUMMY_EVENTS } from "@/schedule/models/event";

type ScheduleState = {
  events: CalendarEvent[];
  currentView: string;
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  setView: (view: string) => void;
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  events: DUMMY_EVENTS,
  currentView: "timeGridWeek",
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
  removeEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    })),
  setView: (view) => set({ currentView: view }),
}));
