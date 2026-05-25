import { useMemo } from "react";

import { useSession } from "@/auth";
import { useUserCalendarEvents } from "@/schedule/hooks/queries/useUserCalendarEvents";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";

function todayRange(): { start: Date; end: Date } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export function useCurrentTimeblock(): CalendarEvent | null {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const range = useMemo(() => todayRange(), []);

  const { data: events } = useUserCalendarEvents(userId ?? "", userId ? range : null);

  return useMemo(() => {
    if (!events) return null;
    const now = new Date();
    return (
      events.find((e) => e.start.getTime() <= now.getTime() && now.getTime() < e.end.getTime()) ??
      null
    );
  }, [events]);
}
