import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { cancelOccurrence } from "@/schedule/apis/cancelOccurrence";
import type { CalendarEventInstanceDto } from "@/schedule/models/calendarEventDto";
import { useCalendarEventsQueryData } from "@/schedule/hooks/queries/useCalendarEventsQueryData";

type CancelOccurrenceInput = {
  eventId: string;
  occurrenceStart: string;
  instanceId: string;
};

export function useCancelOccurrence() {
  const { queryKey } = useCalendarEventsQueryData();
  return useOptimisticMutation<
    CalendarEventInstanceDto[],
    CancelOccurrenceInput
  >({
    queryKey,
    mutationFn: ({ eventId, occurrenceStart }) =>
      cancelOccurrence(eventId, occurrenceStart),
    updater: (previous, input) => {
      if (!previous) return [];
      return previous.filter((dto) => dto.instanceId !== input.instanceId);
    },
  });
}
