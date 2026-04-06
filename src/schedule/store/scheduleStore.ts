import { create } from "zustand";

import {
  DUMMY_EVENTS,
  type CalendarEvent,
} from "@/schedule/models/calendarEvent";

type ScheduleState = {
  calendarTitle: string;
  currentView: string;
  events: CalendarEvent[];
  setView: (view: string) => void;
  setCalendarTitle: (title: string) => void;
};

export const useScheduleStore = create<ScheduleState>((set) => ({
  calendarTitle: "",
  events: DUMMY_EVENTS,
  currentView: "timeGridWeek",
  setView: (view) => set({ currentView: view }),
  setCalendarTitle: (title) => set({ calendarTitle: title }),
}));
