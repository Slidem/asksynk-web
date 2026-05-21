import { toISOStringWithTimezone } from "@/lib/date";
import { cleanString, fromNullable, mapDefined } from "@/lib/optional";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";
import type {
  CalendarEventInstanceDto,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from "@/schedule/models/calendarEventDto";
import type { CalendarEventFormValues } from "@/schedule/models/calendarEventForm";

export function dtoToCalendarEvent(
  dto: CalendarEventInstanceDto,
): CalendarEvent {
  const start = new Date(dto.instanceStart);
  const end = new Date(start.getTime() + dto.durationSeconds * 1000);
  return {
    id: dto.instanceId,
    eventId: dto.eventId,
    title: dto.title,
    start,
    end,
    color: fromNullable(dto.color),
    description: fromNullable(dto.description),
    location: fromNullable(dto.location),
    link: fromNullable(dto.link),
    tagIds: dto.tagIds,
    rrule: dto.rrule,
    durationSeconds: dto.durationSeconds,
    instanceStart: start,
  };
}

export function formToCreateInput(
  form: CalendarEventFormValues,
  id: string,
): CreateCalendarEventInput {
  const start = form.start!;
  const end = form.end!;
  const durationSeconds = Math.round((end.getTime() - start.getTime()) / 1000);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    id,
    title: form.title.trim(),
    description: cleanString(form.description),
    location: cleanString(form.location),
    link: cleanString(form.link),
    start: toISOStringWithTimezone(start),
    durationSeconds,
    timezone,
    rrule: cleanString(form.recurrence)
      ? recurrenceToRrule(form.recurrence)
      : undefined,
    color: form.color || undefined,
    tagIds: mapDefined(form.tagIds, (v) => v),
  };
}

export function formToUpdateInput(
  form: Partial<CalendarEventFormValues>,
): UpdateCalendarEventInput {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    title: mapDefined(form.title, (v) => v.trim()),
    description: mapDefined(form.description, cleanString),
    location: mapDefined(form.location, cleanString),
    link: mapDefined(form.link, cleanString),
    color: mapDefined(form.color, (v) => v || undefined),
    tagIds: mapDefined(form.tagIds, (v) => v),
    rrule: mapDefined(form.recurrence, (v) =>
      v ? recurrenceToRrule(v) : undefined,
    ),
    ...(form.start &&
      form.end && {
        start: toISOStringWithTimezone(form.start),
        durationSeconds: Math.round(
          (form.end.getTime() - form.start.getTime()) / 1000,
        ),
        timezone,
      }),
  };
}

export function calendarEventToFormValues(
  event: CalendarEvent,
): CalendarEventFormValues {
  return {
    title: event.title,
    description: event.description ?? "",
    location: event.location ?? "",
    link: event.link ?? "",
    color: event.color ?? "#4285f4",
    start: event.start,
    end: event.end,
    tagIds: event.tagIds ?? [],
    recurrence: event.rrule ? rruleToRecurrence(event.rrule) : "",
  };
}

export function recurrenceToRrule(preset: string): string {
  return `FREQ=${preset}`;
}

export function rruleToRecurrence(rrule: string): string {
  const match = rrule.match(/FREQ=(\w+)/);
  return match?.[1] ?? "WEEKLY";
}
