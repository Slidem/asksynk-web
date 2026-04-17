import { useMemo } from "react";

import { useScheduleView } from "@/schedule/hooks/useScheduleView";

export function calendarEventsQueryKey(start: Date, end: Date) {
  return [
    "calendar-events",
    { start: start.toISOString(), end: end.toISOString() },
  ] as const;
}

export function useCalendarEventsQueryData() {
  const { viewStart, viewEnd } = useScheduleView();
  const queryKey = useMemo(
    () => calendarEventsQueryKey(viewStart, viewEnd),
    [viewStart, viewEnd],
  );
  return { viewStart, viewEnd, queryKey };
}
