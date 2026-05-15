import { create } from "zustand";

import type { CalendarEvent } from "@/schedule/models/calendarEvent";

interface State {
  opened: boolean;
  event: CalendarEvent | null;
  open: (event: CalendarEvent) => void;
  close: () => void;
}

export const useCalendarEventReadonlyDialogStore = create<State>((set) => ({
  opened: false,
  event: null,
  open: (event) => set({ opened: true, event }),
  close: () => set({ opened: false }),
}));
