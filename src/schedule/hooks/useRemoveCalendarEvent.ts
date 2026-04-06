import { useDummyCalendarStore } from "../store/dummyCalendarStore";

export const useRemoveCalendarEvent = () => {
  // to be replaced with react query mutation
  return useDummyCalendarStore((s) => s.removeEvent);
};
