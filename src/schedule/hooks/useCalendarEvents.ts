import { useMemo } from "react";

import { GHOST_EVENT_ID, type CalendarEvent } from "@/schedule/models/calendarEvent";
import { useGhostEventStore } from "@/schedule/store/ghostEventStore";
import { useScheduleViewStore } from "@/schedule/store/scheduleViewStore";
import { useCalendarEventsQuery } from "@/schedule/hooks/queries/useCalendarEventsQuery";

export function useCalendarEvents(): CalendarEvent[] {
  const { data: serverEvents } = useCalendarEventsQuery();
  const ghostEvent = useGhostEventStore((s) => s.ghostEvent);
  const calendarTagIds = useScheduleViewStore((s) => s.calendarTagIds);

  return useMemo(() => {
    const events = serverEvents ?? [];
    const merged = ghostEvent ? [...events, ghostEvent] : events;
    if (calendarTagIds.length === 0) return merged;
    return merged.filter((e) => {
      if (e.id === GHOST_EVENT_ID) return true;
      return e.tagIds?.some((id) => calendarTagIds.includes(id)) ?? false;
    });
  }, [serverEvents, ghostEvent, calendarTagIds]);
}
