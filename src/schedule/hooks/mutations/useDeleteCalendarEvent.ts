import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { deleteCalendarEvent } from "@/schedule/apis/deleteCalendarEvent";
import type { CalendarEventInstanceDto } from "@/schedule/models/calendarEventDto";
import { useCalendarEventsQueryData } from "@/schedule/hooks/queries/useCalendarEventsQueryData";

export function useDeleteCalendarEvent() {
  const { queryKey } = useCalendarEventsQueryData();
  return useOptimisticMutation<CalendarEventInstanceDto[], string>({
    queryKey,
    mutationFn: (eventId) => deleteCalendarEvent(eventId),
    updater: (previous, eventId) => {
      if (!previous) return [];
      return previous.filter((dto) => dto.eventId !== eventId);
    },
  });
}
