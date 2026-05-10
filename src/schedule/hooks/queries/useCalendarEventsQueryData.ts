import { useMemo } from "react";

import { useScheduleView } from "@/schedule/hooks/useScheduleView";

export function calendarEventsQueryKey(
  start: Date,
  end: Date,
  userId: string | null,
) {
  return [
    "calendar-events",
    { start: start.toISOString(), end: end.toISOString(), userId },
  ] as const;
}

export function useCalendarEventsQueryData() {
  const { viewStart, viewEnd, selectedUserId } = useScheduleView();
  const queryKey = useMemo(
    () => calendarEventsQueryKey(viewStart, viewEnd, selectedUserId),
    [viewStart, viewEnd, selectedUserId],
  );
  return { viewStart, viewEnd, selectedUserId, queryKey };
}
