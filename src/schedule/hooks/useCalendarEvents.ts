import { useMemo } from "react";

import { GHOST_EVENT_ID, type CalendarEvent } from "@/schedule/models/calendarEvent";
import { useGhostEventStore } from "@/schedule/store/ghostEventStore";
import { useScheduleViewStore } from "@/schedule/store/scheduleViewStore";
import { useCalendarEventsQuery } from "@/schedule/hooks/queries/useCalendarEventsQuery";
import { useCalendarProviderCalendars } from "@/integrations/hooks/queries/useCalendarProviderCalendars";

export function useCalendarEvents(): CalendarEvent[] {
  const { data: serverEvents } = useCalendarEventsQuery();
  const ghostEvent = useGhostEventStore((s) => s.ghostEvent);
  const calendarTagIds = useScheduleViewStore((s) => s.calendarTagIds);
  const { data: providerCalendars } = useCalendarProviderCalendars();

  return useMemo(() => {
    const events = serverEvents ?? [];
    // Color imported events by their provider calendar; disable drag/resize.
    const decorated = events.map((e) => {
      const cal = e.calendarId ? providerCalendars?.get(e.calendarId) : undefined;
      const color = e.color ?? cal?.color ?? undefined;
      if (e.readOnly) {
        return { ...e, color, editable: false };
      }
      return color === e.color ? e : { ...e, color };
    });
    const merged = ghostEvent ? [...decorated, ghostEvent] : decorated;
    if (calendarTagIds.length === 0) return merged;
    return merged.filter((e) => {
      if (e.id === GHOST_EVENT_ID) return true;
      return e.tagIds?.some((id) => calendarTagIds.includes(id)) ?? false;
    });
  }, [serverEvents, ghostEvent, calendarTagIds, providerCalendars]);
}
