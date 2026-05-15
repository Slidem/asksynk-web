import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchCalendarEvents } from "@/schedule/apis/fetchCalendarEvents";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";
import { useCalendarEventsQueryData } from "./useCalendarEventsQueryData";

export function useCalendarEventsQuery() {
  const { viewStart, viewEnd, selectedUserId, queryKey } =
    useCalendarEventsQueryData();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useQuery({
    queryKey,
    queryFn: () =>
      fetchCalendarEvents(viewStart, viewEnd, timezone, selectedUserId),
    placeholderData: keepPreviousData,
    select: (data) => data.map(dtoToCalendarEvent),
    enabled: !!viewStart && !!viewEnd,
  });
}
