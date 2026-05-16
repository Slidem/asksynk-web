import { useShallow } from "zustand/shallow";
import { useScheduleViewStore } from "../store/scheduleViewStore";

export const useScheduleView = () => {
  return useScheduleViewStore(
    useShallow((s) => ({
      calendarTitle: s.calendarTitle,
      currentView: s.currentView,
      viewStart: s.viewStart,
      viewEnd: s.viewEnd,
      selectedUserId: s.selectedUserId,
      calendarTagIds: s.calendarTagIds,
    })),
  );
};
