import type FullCalendar from "@fullcalendar/react";
import type { RefObject } from "react";

import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import {
  usePublicScheduleView,
  usePublicScheduleViewHandlers,
} from "@/public-schedule/hooks/usePublicScheduleView";

interface Props {
  calendarRef: RefObject<FullCalendar | null>;
}

export function PublicScheduleToolbar({ calendarRef }: Props) {
  const { calendarTitle, currentView } = usePublicScheduleView();
  const { setView } = usePublicScheduleViewHandlers();

  return (
    <CalendarToolbar
      calendarRef={calendarRef}
      calendarTitle={calendarTitle}
      currentView={currentView}
      onViewChange={setView}
    />
  );
}
