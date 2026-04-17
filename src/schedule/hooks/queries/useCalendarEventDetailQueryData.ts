import { useMemo } from "react";

export function calendarEventDetailQueryKey(eventId: string) {
  return ["calendar-event", eventId] as const;
}

export function useCalendarEventDetailQueryData(eventId: string | null) {
  const queryKey = useMemo(
    () => calendarEventDetailQueryKey(eventId ?? ""),
    [eventId],
  );
  return { eventId, queryKey };
}
