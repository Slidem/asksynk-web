import { useMemo } from "react";

import { usePublicScheduleView } from "@/public-schedule/hooks/usePublicScheduleView";

export function publicCalendarEventsQueryKey(
  slug: string,
  start: Date,
  end: Date,
) {
  return [
    "public-calendar-events",
    slug,
    { start: start.toISOString(), end: end.toISOString() },
  ] as const;
}

export function usePublicCalendarEventsQueryData(slug: string) {
  const { viewStart, viewEnd } = usePublicScheduleView();
  const queryKey = useMemo(
    () => publicCalendarEventsQueryKey(slug, viewStart, viewEnd),
    [slug, viewStart, viewEnd],
  );
  return { viewStart, viewEnd, queryKey };
}
