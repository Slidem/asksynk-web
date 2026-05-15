import { useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchCalendarEvents } from "@/schedule/apis/fetchCalendarEvents";
import { calendarEventsQueryKey } from "@/schedule/hooks/queries/useCalendarEventsQueryData";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";

interface Range {
  start: Date;
  end: Date;
}

export function useUserCalendarEvents(userId: string, range: Range | null) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const queryKey = useMemo(
    () => (range ? calendarEventsQueryKey(range.start, range.end, userId) : []),
    [range, userId],
  );

  return useQuery({
    queryKey,
    queryFn: () =>
      fetchCalendarEvents(range!.start, range!.end, timezone, userId),
    enabled: !!range,
    placeholderData: keepPreviousData,
    select: (data) => data.map(dtoToCalendarEvent),
  });
}
