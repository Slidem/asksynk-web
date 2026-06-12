import { useMemo } from "react";

import { useSession } from "@/auth";
import {
  findCurrentTimeblock,
  todayRange,
} from "@/attentionItems/utils/currentTimeblock";
import { useUserCalendarEvents } from "@/schedule/hooks/queries/useUserCalendarEvents";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";

export function useCurrentTimeblock(): CalendarEvent | null {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const range = useMemo(() => todayRange(), []);

  const { data: events } = useUserCalendarEvents(
    userId ?? "",
    userId ? range : null,
  );

  return useMemo(() => {
    if (!events) return null;
    return findCurrentTimeblock(events, new Date());
  }, [events]);
}
