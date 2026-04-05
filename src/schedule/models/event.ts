export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  color?: string;
  display?: string;
};

export const GHOST_EVENT_ID = "ghost";

const today = new Date();

const day = (dayOffset: number, hour: number, minute = 0) => {
  const date = new Date(today);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const DUMMY_EVENTS: CalendarEvent[] = [
  { id: "1", title: "Team standup", start: day(0, 9), end: day(0, 9, 30) },
  { id: "2", title: "Product review", start: day(0, 14), end: day(0, 15, 30) },
  { id: "3", title: "1:1 with Alex", start: day(1, 10), end: day(1, 11) },
  { id: "4", title: "Design sync", start: day(1, 15), end: day(1, 16) },
  { id: "5", title: "Sprint planning", start: day(2, 9), end: day(2, 11) },
  { id: "6", title: "Customer call", start: day(3, 13), end: day(3, 14) },
  { id: "7", title: "Retrospective", start: day(4, 16), end: day(4, 17) },
];
