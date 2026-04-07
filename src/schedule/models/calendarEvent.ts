export type CalendarEvent = {
  id: string;
  eventId: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  display?: string;
  description?: string;
  location?: string;
  link?: string;
  tagIds?: string[];
  rrule: string | null;
  durationSeconds: number;
  instanceStart: string;
};

export const GHOST_EVENT_ID = "ghost";
