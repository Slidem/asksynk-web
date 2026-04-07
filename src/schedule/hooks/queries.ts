import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useScheduleStore } from "../store/scheduleStore";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";
import { ensureCalendar, fetchCalendarEvent, fetchCalendarEvents } from "./api";

export function calendarEventsQueryKey(start: Date, end: Date) {
  return [
    "calendar-events",
    { start: start.toISOString(), end: end.toISOString() },
  ] as const;
}

export function useCalendarEventsQueryData() {
  const viewStart = useScheduleStore((s) => s.viewStart);
  const viewEnd = useScheduleStore((s) => s.viewEnd);
  const queryKey = useMemo(
    () => calendarEventsQueryKey(viewStart, viewEnd),
    [viewStart, viewEnd],
  );
  return { viewStart, viewEnd, queryKey };
}

export function useCalendarEventsQuery() {
  const { viewStart, viewEnd, queryKey } = useCalendarEventsQueryData();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return useQuery({
    queryKey,
    queryFn: () => fetchCalendarEvents(viewStart, viewEnd, timezone),
    placeholderData: keepPreviousData,
    select: (data) => data.map(dtoToCalendarEvent),
    enabled: !!viewStart && !!viewEnd,
  });
}

export function calendarEventDetailQueryKey(eventId: string) {
  return ["calendar-event", eventId] as const;
}

export function useCalendarEventDetail(eventId: string | null) {
  return useQuery({
    queryKey: calendarEventDetailQueryKey(eventId ?? ""),
    queryFn: () => fetchCalendarEvent(eventId!),
    enabled: !!eventId,
    select: dtoToCalendarEvent,
  });
}

export function useEnsureCalendar() {
  return useQuery({
    queryKey: ["calendar"],
    queryFn: ensureCalendar,
    staleTime: Infinity,
  });
}
