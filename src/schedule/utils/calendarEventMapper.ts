import { toISOStringWithTimezone } from "@/lib/date";
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
  return {
    id: dto.instanceId,
    eventId: dto.eventId,
    title: dto.title,
    start,
    end: new Date(start.getTime() + dto.durationSeconds * 1000),
    color: dto.color ?? undefined,
    description: dto.description ?? undefined,
    location: dto.location ?? undefined,
    link: dto.link ?? undefined,
    tagIds: dto.tagIds,
    rrule: dto.rrule,
    durationSeconds: dto.durationSeconds,
    instanceStart: dto.instanceStart,
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
    description: form.description.trim() || undefined,
    location: form.location.trim() || undefined,
    link: form.link.trim() || undefined,
    start: toISOStringWithTimezone(start),
    durationSeconds,
    timezone,
    rrule: form.isRecurring ? recurrenceToRrule(form.recurrence) : undefined,
    color: form.color || undefined,
    tagIds: form.tagIds.length > 0 ? form.tagIds : undefined,
  };
}

export function formToUpdateInput(
  form: Partial<CalendarEventFormValues>,
): UpdateCalendarEventInput {
  const input: UpdateCalendarEventInput = {};
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (form.title !== undefined) input.title = form.title.trim();
  if (form.description !== undefined)
    input.description = form.description.trim() || undefined;
  if (form.location !== undefined)
    input.location = form.location.trim() || undefined;
  if (form.link !== undefined) input.link = form.link.trim() || undefined;

  if (form.start && form.end) {
    input.start = toISOStringWithTimezone(form.start);
    input.durationSeconds = Math.round(
      (form.end.getTime() - form.start.getTime()) / 1000,
    );
    input.timezone = timezone;
  }

  if (form.color !== undefined) input.color = form.color || undefined;
  if (form.tagIds !== undefined) input.tagIds = form.tagIds;

  if (form.isRecurring !== undefined && form.recurrence !== undefined) {
    input.rrule = form.isRecurring
      ? recurrenceToRrule(form.recurrence)
      : undefined;
  }

  return input;
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
    isRecurring: event.rrule !== null,
    recurrence: event.rrule ? rruleToRecurrence(event.rrule) : "WEEKLY",
  };
}

export function recurrenceToRrule(preset: string): string {
  return `FREQ=${preset}`;
}

export function rruleToRecurrence(rrule: string): string {
  const match = rrule.match(/FREQ=(\w+)/);
  return match?.[1] ?? "WEEKLY";
}
