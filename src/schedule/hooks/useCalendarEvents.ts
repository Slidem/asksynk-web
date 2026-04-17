import { useMemo } from "react";

import type { CalendarEvent } from "@/schedule/models/calendarEvent";
import { useGhostEventStore } from "@/schedule/store/ghostEventStore";
import { useCalendarEventsQuery } from "@/schedule/hooks/queries/useCalendarEventsQuery";

export function useCalendarEvents(): CalendarEvent[] {
  const { data: serverEvents } = useCalendarEventsQuery();
  const ghostEvent = useGhostEventStore((s) => s.ghostEvent);

  return useMemo(() => {
    const events = serverEvents ?? [];
    return ghostEvent ? [...events, ghostEvent] : events;
  }, [serverEvents, ghostEvent]);
}
