import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchCalendarEvents } from "@/schedule/apis/fetchCalendarEvents";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";
import { calendarEventsQueryKey } from "@/schedule/hooks/queries/useCalendarEventsQueryData";

const UPCOMING_LIMIT = 5;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function useUpcomingTagCalendarEvents(tagId: string) {
  const [start, end] = useMemo(() => {
    const s = new Date();
    const e = new Date(s.getTime() + SEVEN_DAYS_MS);
    return [s, e];
  }, []);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useQuery({
    queryKey: calendarEventsQueryKey(start, end, null),
    queryFn: () => fetchCalendarEvents(start, end, timezone),
    select: (data) =>
      data
        .map(dtoToCalendarEvent)
        .filter((e) => e.tagIds?.includes(tagId))
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, UPCOMING_LIMIT),
    enabled: !!tagId,
  });
}
