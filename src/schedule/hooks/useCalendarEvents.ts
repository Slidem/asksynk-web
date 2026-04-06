import { useDummyCalendarStore } from "../store/dummyCalendarStore";

export const useCalendarEvents = () => {
  return useDummyCalendarStore((s) => s.events);
};
