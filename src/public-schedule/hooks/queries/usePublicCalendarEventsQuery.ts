import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchPublicCalendarEvents } from "@/public-schedule/apis/fetchPublicCalendarEvents";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";
import { usePublicCalendarEventsQueryData } from "@/public-schedule/hooks/queries/usePublicCalendarEventsQueryData";

export function usePublicCalendarEventsQuery(slug: string) {
  const { viewStart, viewEnd, queryKey } =
    usePublicCalendarEventsQueryData(slug);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useQuery({
    queryKey,
    queryFn: () => fetchPublicCalendarEvents(viewStart, viewEnd, timezone),
    placeholderData: keepPreviousData,
    select: (data) => data.map(dtoToCalendarEvent),
    enabled: !!viewStart && !!viewEnd,
    retry: false,
  });
}
