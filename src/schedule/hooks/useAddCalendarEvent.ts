import type { CalendarEvent } from "@/schedule/models/calendarEvent";
import { useDummyCalendarStore } from "../store/dummyCalendarStore";

export const useAddCalendarEvent = () => {
  // to be replaced with react query mutation
  const addEvent = useDummyCalendarStore((s) => s.addEvent);

  return (event: CalendarEvent) => {
    addEvent(event);
  };
};
