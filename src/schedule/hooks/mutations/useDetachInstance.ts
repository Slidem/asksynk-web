import { useMutation, useQueryClient } from "@tanstack/react-query";

import { detachInstance } from "@/schedule/apis/detachInstance";
import type { UpdateCalendarEventInput } from "@/schedule/models/calendarEventDto";
import { useCalendarEventsQueryData } from "@/schedule/hooks/queries/useCalendarEventsQueryData";

type DetachInstanceInput = {
  eventId: string;
  instanceStart: string;
  dto: UpdateCalendarEventInput;
};

export function useDetachInstance() {
  const { queryKey } = useCalendarEventsQueryData();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, instanceStart, dto }: DetachInstanceInput) =>
      detachInstance(eventId, instanceStart, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
