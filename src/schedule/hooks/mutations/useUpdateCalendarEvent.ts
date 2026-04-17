import { ifPresent } from "@/lib/optional";
import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { updateCalendarEvent } from "@/schedule/apis/updateCalendarEvent";
import type {
  CalendarEventInstanceDto,
  UpdateCalendarEventInput,
} from "@/schedule/models/calendarEventDto";
import { useCalendarEventsQueryData } from "@/schedule/hooks/queries/useCalendarEventsQueryData";

type UpdateEventInput = {
  eventId: string;
  update: UpdateCalendarEventInput;
};

export function useUpdateCalendarEvent() {
  const { queryKey } = useCalendarEventsQueryData();
  return useOptimisticMutation<CalendarEventInstanceDto[], UpdateEventInput>({
    queryKey,
    mutationFn: ({ eventId, update }) => updateCalendarEvent(eventId, update),
    updater: (previous, input) => {
      if (!previous) return [];
      return previous.map((dto) => {
        if (dto.eventId !== input.eventId) {
          return dto;
        }
        return {
          ...dto,
          title: ifPresent(input.update.title).or(dto.title),
          description: ifPresent(input.update.description).or(dto.description),
          location: ifPresent(input.update.location).or(dto.location),
          link: ifPresent(input.update.link).or(dto.link),
          color: ifPresent(input.update.color).or(dto.color),
          tagIds: ifPresent(input.update.tagIds).or(dto.tagIds),
          rrule: ifPresent(input.update.rrule).or(dto.rrule),
          instanceStart: ifPresent(input.update.start).or(dto.instanceStart),
          durationSeconds: ifPresent(input.update.durationSeconds).or(
            dto.durationSeconds,
          ),
        };
      });
    },
  });
}
