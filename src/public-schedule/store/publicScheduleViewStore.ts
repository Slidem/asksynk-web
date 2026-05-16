import { create } from "zustand";

interface Props {
  viewStart: Date;
  viewEnd: Date;
  calendarTitle: string;
  currentView: string;
  calendarTagIds: string[];
  setView: (view: string) => void;
  setCalendarTitle: (title: string) => void;
  setViewRange: (start: Date, end: Date) => void;
  setCalendarTagIds: (ids: string[]) => void;
}

export const usePublicScheduleViewStore = create<Props>((set) => ({
  calendarTitle: "",
  currentView: "timeGridWeek",
  viewStart: new Date(),
  viewEnd: new Date(),
  calendarTagIds: [],
  setView: (view) => set({ currentView: view }),
  setCalendarTitle: (title) => set({ calendarTitle: title }),
  setViewRange: (viewStart, viewEnd) => set({ viewStart, viewEnd }),
  setCalendarTagIds: (calendarTagIds) => set({ calendarTagIds }),
}));
