import { useCalendarEventDialogStore } from "../store/calendarEventDialogStore";

export const useCloseEventDialog = () => {
  return useCalendarEventDialogStore((s) => s.close);
};
