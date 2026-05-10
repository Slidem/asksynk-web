import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchCalendarEvents } from "@/schedule/apis/fetchCalendarEvents";
import { fetchNetworkUserCalendarEvents } from "@/schedule/apis/fetchNetworkUserCalendarEvents";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";
import { useCalendarEventsQueryData } from "./useCalendarEventsQueryData";

export function useCalendarEventsQuery() {
  const { viewStart, viewEnd, selectedUserId, queryKey } =
    useCalendarEventsQueryData();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useQuery({
    queryKey,
    queryFn: () =>
      selectedUserId
        ? fetchNetworkUserCalendarEvents(
            selectedUserId,
            viewStart,
            viewEnd,
            timezone,
          )
        : fetchCalendarEvents(viewStart, viewEnd, timezone),
    placeholderData: keepPreviousData,
    select: (data) => data.map(dtoToCalendarEvent),
    enabled: !!viewStart && !!viewEnd,
  });
}
