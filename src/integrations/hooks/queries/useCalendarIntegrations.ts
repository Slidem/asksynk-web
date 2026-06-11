import { useQuery } from "@tanstack/react-query";

import { fetchIntegrations } from "@/integrations/apis/fetchIntegrations";
import type { CalendarIntegrationDto } from "@/integrations/models/calendarIntegration";
import { calendarIntegrationsQueryKey } from "./useCalendarIntegrationsQueryData";

export function useCalendarIntegrations<T = CalendarIntegrationDto[]>(
  selectFn?: (data: CalendarIntegrationDto[]) => T,
) {
  return useQuery({
    queryKey: calendarIntegrationsQueryKey,
    queryFn: fetchIntegrations,
    placeholderData: [],
    select: selectFn ?? undefined,
  });
}
