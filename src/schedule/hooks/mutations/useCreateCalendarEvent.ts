import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCalendarEvent } from "@/schedule/apis/createCalendarEvent";
import type { CreateCalendarEventInput } from "@/schedule/models/calendarEventDto";
import { useCalendarEventsQueryData } from "@/schedule/hooks/queries/useCalendarEventsQueryData";

export function useCreateCalendarEvent() {
  const { queryKey } = useCalendarEventsQueryData();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCalendarEventInput) => createCalendarEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
