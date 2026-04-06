import type { CalendarEvent } from "../models/calendarEvent";
import { useDummyCalendarStore } from "../store/dummyCalendarStore";

export const useUpdateCalendarEvent = () => {
  // to be replaced with react query mutation
  const updateEvent = useDummyCalendarStore((s) => s.updateEvent);
  return (id: string, updates: Omit<Partial<CalendarEvent>, "id">) => {
    updateEvent(id, updates);
  };
};
