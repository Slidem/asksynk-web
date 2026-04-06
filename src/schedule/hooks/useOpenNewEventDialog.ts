import { useCalendarEventDialogStore } from "../store/calendarEventDialogStore";
import { useAddCalendarEvent } from "./useAddCalendarEvent";

export const useOpenNewEventDialog = () => {
  const openDialog = useCalendarEventDialogStore((s) => s.open);
  const addEvent = useAddCalendarEvent();

  return (start: Date, end: Date) => {
    openDialog({
      mode: "create",
      actionText: "Create",
      onAction: addEvent,
      start,
      end,
    });
  };
};
