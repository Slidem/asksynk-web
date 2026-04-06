import type { CalendarEvent } from "../models/calendarEvent";
import { useCalendarEventDialogStore } from "../store/calendarEventDialogStore";
import { useUpdateCalendarEvent } from "./useUpdateCalendarEvent";

export const useOpenEditEventDialog = () => {
  const openDialog = useCalendarEventDialogStore((s) => s.open);
  const updateEvent = useUpdateCalendarEvent();

  return (event: CalendarEvent) => {
    openDialog({
      mode: "edit",
      event,
      actionText: "Update",
      onAction: (updatedEvent) => {
        updateEvent(event.id, updatedEvent);
      },
    });
  };
};
