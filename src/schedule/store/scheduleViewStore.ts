import { create } from "zustand";

type ScheduleState = {
  viewStart: Date;
  viewEnd: Date;
  calendarTitle: string;
  currentView: string;
  selectedUserId: string | null;
  setView: (view: string) => void;
  setCalendarTitle: (title: string) => void;
  setViewRange: (start: Date, end: Date) => void;
  setSelectedUserId: (userId: string | null) => void;
};

export const useScheduleViewStore = create<ScheduleState>((set) => ({
  calendarTitle: "",
  currentView: "timeGridWeek",
  viewStart: new Date(),
  viewEnd: new Date(),
  selectedUserId: null,
  setView: (view) => set({ currentView: view }),
  setCalendarTitle: (title) => set({ calendarTitle: title }),
  setViewRange: (viewStart, viewEnd) => set({ viewStart, viewEnd }),
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
}));
