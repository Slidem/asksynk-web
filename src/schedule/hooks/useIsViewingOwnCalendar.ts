import { useScheduleViewStore } from "@/schedule/store/scheduleViewStore";

export const useIsViewingOwnCalendar = () => {
  return useScheduleViewStore((s) => s.selectedUserId === null);
};
