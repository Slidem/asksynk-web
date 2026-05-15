import { useQuery } from "@tanstack/react-query";

import { fetchCalendarEvents } from "@/schedule/apis/fetchCalendarEvents";
import { calendarEventsQueryKey } from "@/schedule/hooks/queries/useCalendarEventsQueryData";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";
import { useOneWeekCalendarPeriod } from "./useOneWeekCalendarPeriod";

export function useUpcomingUserCalendarEvents(userId?: string | null) {
  const { start, end } = useOneWeekCalendarPeriod();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useQuery({
    queryKey: calendarEventsQueryKey(start, end, userId ?? null),
    queryFn: () => fetchCalendarEvents(start, end, timezone, userId),
    select: (data) =>
      data
        .map(dtoToCalendarEvent)
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
  });
}
