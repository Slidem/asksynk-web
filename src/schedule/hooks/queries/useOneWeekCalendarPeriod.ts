import { useMemo } from "react";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const useOneWeekCalendarPeriod = () => {
  return useMemo(() => {
    const s = new Date();
    s.setHours(0, 0, 0, 0); // reset to local midnight
    const e = new Date(s.getTime() + SEVEN_DAYS_MS);
    return { start: s, end: e };
  }, []);
};
