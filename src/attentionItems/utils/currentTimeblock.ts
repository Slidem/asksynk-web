import type { CalendarEvent } from "@/schedule/models/calendarEvent";

export function todayRange(): { start: Date; end: Date } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

// The event whose range contains `now` (start ≤ now < end), or null.
export function findCurrentTimeblock(
  events: readonly CalendarEvent[],
  now: Date,
): CalendarEvent | null {
  const t = now.getTime();
  return (
    events.find((e) => e.start.getTime() <= t && t < e.end.getTime()) ?? null
  );
}
