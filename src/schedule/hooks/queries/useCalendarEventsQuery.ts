import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchCalendarEvents } from "@/schedule/apis/fetchCalendarEvents";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";
import { useCalendarEventsQueryData } from "./useCalendarEventsQueryData";

export function useCalendarEventsQuery() {
  const { viewStart, viewEnd, selectedUserId, queryKey } =
    useCalendarEventsQueryData();

  return useQuery({
    queryKey,
    queryFn: () =>
      fetchCalendarEvents(viewStart, viewEnd, selectedUserId),
    placeholderData: keepPreviousData,
    select: (data) => data.map(dtoToCalendarEvent),
    enabled: !!viewStart && !!viewEnd,
  });
}
