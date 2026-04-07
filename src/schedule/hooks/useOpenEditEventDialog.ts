import type { CalendarEvent } from "@/schedule/models/calendarEvent";
import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";

export function useOpenEditEventDialog() {
  const open = useCalendarEventDialogStore((s) => s.open);

  return (event: CalendarEvent) => {
    open({ mode: "edit", event });
  };
}
