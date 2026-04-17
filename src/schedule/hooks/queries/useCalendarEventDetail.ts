import { useQuery } from "@tanstack/react-query";

import { fetchCalendarEvent } from "@/schedule/apis/fetchCalendarEvent";
import { dtoToCalendarEvent } from "@/schedule/utils/calendarEventMapper";
import { useCalendarEventDetailQueryData } from "./useCalendarEventDetailQueryData";

export function useCalendarEventDetail(eventId: string | null) {
  const { queryKey } = useCalendarEventDetailQueryData(eventId);
  return useQuery({
    queryKey,
    queryFn: () => fetchCalendarEvent(eventId!),
    enabled: !!eventId,
    select: dtoToCalendarEvent,
  });
}
