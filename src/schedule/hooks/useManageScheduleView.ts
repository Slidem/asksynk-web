import { useShallow } from "zustand/shallow";
import { useScheduleViewStore } from "../store/scheduleViewStore";

export const useManageScheduleView = () => {
  return useScheduleViewStore(
    useShallow((s) => ({
      setView: s.setView,
      setCalendarTitle: s.setCalendarTitle,
      setViewRange: s.setViewRange,
      setSelectedUserId: s.setSelectedUserId,
    })),
  );
};
