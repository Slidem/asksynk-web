import { create } from "zustand";

type ScheduleState = {
  viewStart: Date;
  viewEnd: Date;
  calendarTitle: string;
  currentView: string;
  selectedUserId: string | null;
  calendarTagIds: string[];
  setView: (view: string) => void;
  setCalendarTitle: (title: string) => void;
  setViewRange: (start: Date, end: Date) => void;
  setSelectedUserId: (userId: string | null) => void;
  setCalendarTagIds: (ids: string[]) => void;
};

export const useScheduleViewStore = create<ScheduleState>((set) => ({
  calendarTitle: "",
  currentView: "timeGridWeek",
  viewStart: new Date(),
  viewEnd: new Date(),
  selectedUserId: null,
  calendarTagIds: [],
  setView: (view) => set({ currentView: view }),
  setCalendarTitle: (title) => set({ calendarTitle: title }),
  setViewRange: (viewStart, viewEnd) => set({ viewStart, viewEnd }),
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
  setCalendarTagIds: (calendarTagIds) => set({ calendarTagIds }),
}));
