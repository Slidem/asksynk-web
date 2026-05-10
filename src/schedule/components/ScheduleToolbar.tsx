import type FullCalendar from "@fullcalendar/react";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { RefObject } from "react";

import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { useOpenNewEventDialog } from "@/schedule/hooks/dialogs/calendarEventDialogHooks";
import { useIsViewingOwnCalendar } from "@/schedule/hooks/useIsViewingOwnCalendar";
import { useManageScheduleView } from "@/schedule/hooks/useManageScheduleView";
import { useScheduleView } from "@/schedule/hooks/useScheduleView";

type ScheduleToolbarProps = {
  calendarRef: RefObject<FullCalendar | null>;
};

export function ScheduleToolbar({ calendarRef }: ScheduleToolbarProps) {
  const { calendarTitle, currentView } = useScheduleView();
  const { setView } = useManageScheduleView();
  const openNewEventDialog = useOpenNewEventDialog();
  const isOwn = useIsViewingOwnCalendar();

  const handleNewEvent = () => {
    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000);
    openNewEventDialog(now, end);
  };

  return (
    <CalendarToolbar
      calendarRef={calendarRef}
      calendarTitle={calendarTitle}
      currentView={currentView}
      onViewChange={setView}
      rightSection={
        isOwn ? (
          <Button
            size="compact-sm"
            leftSection={<IconPlus size={14} />}
            onClick={handleNewEvent}
          >
            New event
          </Button>
        ) : undefined
      }
    />
  );
}
