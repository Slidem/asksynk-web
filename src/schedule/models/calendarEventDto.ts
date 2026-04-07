export interface CalendarDto {
  id: string;
  userId: string;
  source: string;
  color: string | null;
}

export interface CalendarEventInstanceDto {
  eventId: string;
  instanceId: string;
  title: string;
  description: string | null;
  location: string | null;
  link: string | null;
  instanceStart: string;
  durationSeconds: number;
  allDay: boolean;
  timezone: string;
  rrule: string | null;
  color: string | null;
  tagIds: string[];
}

export interface CreateCalendarEventInput {
  id: string;
  title: string;
  description?: string;
  location?: string;
  link?: string;
  start: string;
  durationSeconds: number;
  allDay?: boolean;
  timezone: string;
  rrule?: string;
  color?: string;
  tagIds?: string[];
}

export interface UpdateCalendarEventInput {
  title?: string;
  description?: string;
  location?: string;
  link?: string;
  start?: string;
  durationSeconds?: number;
  allDay?: boolean;
  timezone?: string;
  rrule?: string;
  color?: string;
  tagIds?: string[];
}
