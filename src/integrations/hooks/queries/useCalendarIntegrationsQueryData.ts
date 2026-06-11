export const calendarIntegrationsQueryKey = ["calendar-integrations"] as const;

export function useCalendarIntegrationsQueryData() {
  return { queryKey: calendarIntegrationsQueryKey };
}
