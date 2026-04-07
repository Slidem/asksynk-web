import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";

export function useOpenNewEventDialog() {
  const open = useCalendarEventDialogStore((s) => s.open);

  return (start: Date, end: Date) => {
    open({ mode: "create", start, end });
  };
}
