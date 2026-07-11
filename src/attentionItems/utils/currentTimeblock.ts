import type { CalendarEvent } from "@/schedule/models/calendarEvent";

export function todayRange(): { start: Date; end: Date } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

// All events whose range contains `now` (start ≤ now < end). Multiple when
// timeblocks overlap.
export function findCurrentTimeblocks(
  events: readonly CalendarEvent[],
  now: Date,
): CalendarEvent[] {
  const t = now.getTime();
  return events.filter((e) => e.start.getTime() <= t && t < e.end.getTime());
}
