import { useQuery } from "@tanstack/react-query";

import { isOnPublicView } from "@/lib/public";
import { fetchCalendarEvents } from "@/schedule/apis/fetchCalendarEvents";
import { calendarEventsQueryKey } from "@/schedule/hooks/queries/useCalendarEventsQueryData";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";
import { useOneWeekCalendarPeriod } from "./useOneWeekCalendarPeriod";

const UPCOMING_LIMIT = 5;

export function useUpcomingTagCalendarEvents(
  tagId: string,
  userId?: string | null,
) {
  const { start, end } = useOneWeekCalendarPeriod();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // On a public view the guest session already scopes /calendar-events to the
  // view owner, so omit userId (guests can't query another user's calendar by id).
  const effectiveUserId = isOnPublicView() ? null : (userId ?? null);

  return useQuery({
    queryKey: calendarEventsQueryKey(start, end, effectiveUserId),
    queryFn: () => fetchCalendarEvents(start, end, timezone, effectiveUserId),
    select: (data) =>
      data
        .map(dtoToCalendarEvent)
        .filter((e) => e.tagIds?.includes(tagId))
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .slice(0, UPCOMING_LIMIT),
    enabled: !!tagId,
  });
}
