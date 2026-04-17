import { useMutation, useQueryClient } from "@tanstack/react-query";

import { splitSeries } from "@/schedule/apis/splitSeries";
import type { UpdateCalendarEventInput } from "@/schedule/models/calendarEventDto";
import { useCalendarEventsQueryData } from "@/schedule/hooks/queries/useCalendarEventsQueryData";

type SplitSeriesInput = {
  eventId: string;
  splitStart: string;
  dto: UpdateCalendarEventInput;
};

export function useSplitSeries() {
  const { queryKey } = useCalendarEventsQueryData();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, splitStart, dto }: SplitSeriesInput) =>
      splitSeries(eventId, splitStart, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
