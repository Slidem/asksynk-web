import { useMemo } from "react";

import { useSession } from "@/auth";
import {
  findCurrentTimeblocks,
  todayRange,
} from "@/attentionItems/utils/currentTimeblock";
import { useNow } from "@/lib/useNow";
import { useUserCalendarEvents } from "@/schedule/hooks/queries/useUserCalendarEvents";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";

const TICK_MS = 30_000;

// All timeblocks (calendar events) currently in progress. Re-evaluates on a
// coarse tick so blocks enter/leave as time passes.
export function useCurrentTimeblocks(): CalendarEvent[] {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const range = useMemo(() => todayRange(), []);
  const now = useNow(TICK_MS);

  const { data: events } = useUserCalendarEvents(
    userId ?? "",
    userId ? range : null,
  );

  return useMemo(() => {
    if (!events) return [];
    return findCurrentTimeblocks(events, now);
  }, [events, now]);
}
