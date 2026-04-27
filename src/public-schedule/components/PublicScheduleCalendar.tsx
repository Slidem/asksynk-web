import type { DatesSetArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Paper } from "@mantine/core";
import { useRef } from "react";

import {
  usePublicScheduleView,
  usePublicScheduleViewHandlers,
} from "@/public-schedule/hooks/usePublicScheduleView";
import { usePublicCalendarEventsQuery } from "@/public-schedule/hooks/queries/usePublicCalendarEventsQuery";
import classes from "@/schedule/components/ScheduleCalendar.module.css";
import { PublicScheduleToolbar } from "@/public-schedule/components/PublicScheduleToolbar";

interface Props {
  slug: string;
}

export function PublicScheduleCalendar({ slug }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  const { currentView } = usePublicScheduleView();
  const { setViewRange, setCalendarTitle } = usePublicScheduleViewHandlers();
  const { data: events } = usePublicCalendarEventsQuery(slug);

  const handleDatesSet = (arg: DatesSetArg) => {
    setCalendarTitle(arg.view.title);
    setViewRange(arg.start, arg.end);
  };

  return (
    <Paper
      radius={0}
      p="md"
      className={classes.wrapper}
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PublicScheduleToolbar calendarRef={calendarRef} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView={currentView}
          headerToolbar={false}
          events={events ?? []}
          editable={false}
          selectable={false}
          dayMaxEvents
          slotLabelFormat={{ hour: "numeric", meridiem: "short" }}
          nowIndicator
          datesSet={handleDatesSet}
          height="100%"
        />
      </div>
    </Paper>
  );
}
