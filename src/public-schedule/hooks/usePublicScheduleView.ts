import { usePublicScheduleViewStore } from "@/public-schedule/store/publicScheduleViewStore";
import { useShallow } from "zustand/shallow";

export const usePublicScheduleView = () => {
  return usePublicScheduleViewStore(
    useShallow((s) => ({
      calendarTitle: s.calendarTitle,
      currentView: s.currentView,
      viewStart: s.viewStart,
      viewEnd: s.viewEnd,
    })),
  );
};

export const usePublicScheduleViewHandlers = () => {
  return usePublicScheduleViewStore(
    useShallow((s) => ({
      setView: s.setView,
      setCalendarTitle: s.setCalendarTitle,
      setViewRange: s.setViewRange,
    })),
  );
};

export const usePublicCalendarTagFilter = () =>
  usePublicScheduleViewStore((s) => s.calendarTagIds);

export const useSetPublicCalendarTagIds = () =>
  usePublicScheduleViewStore((s) => s.setCalendarTagIds);
