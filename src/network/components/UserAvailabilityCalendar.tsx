import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import { useRef, useState } from "react";
import type { DatesSetArg, EventClickArg } from "@fullcalendar/core";

import { CalendarToolbar } from "@/components/calendar/CalendarToolbar";
import { CalendarEventReadonlyDialog } from "@/network/components/CalendarEventReadonlyDialog";
import { useCalendarEventReadonlyDialogHandlers } from "@/network/hooks/dialogs/calendarEventReadonlyDialogHooks";
import { useUserCalendarEvents } from "@/schedule/hooks/queries/useUserCalendarEvents";
import calendarClasses from "@/schedule/components/ScheduleCalendar.module.css";

interface Props {
  userId: string;
}

const VIEW_OPTIONS = [
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
];

export function UserAvailabilityCalendar({ userId }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);
  const [view, setView] = useState("timeGridWeek");
  const [calendarTitle, setCalendarTitle] = useState("");

  const { data: events } = useUserCalendarEvents(userId, range);
  const { open: openEventDialog } = useCalendarEventReadonlyDialogHandlers();

  const handleDatesSet = (arg: DatesSetArg) => {
    setRange({ start: arg.start, end: arg.end });
    setCalendarTitle(arg.view.title);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const event = events?.find((e) => e.id === arg.event.id);
    if (event) openEventDialog(event);
  };

  const handleViewChange = (value: string) => {
    setView(value);
    calendarRef.current?.getApi().changeView(value);
  };

  return (
    <div
      className={calendarClasses.wrapper}
      style={{ display: "flex", flexDirection: "column", height: 520 }}
    >
      <CalendarToolbar
        calendarRef={calendarRef}
        calendarTitle={calendarTitle}
        currentView={view}
        onViewChange={handleViewChange}
        viewOptions={VIEW_OPTIONS}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          events={events ?? []}
          editable={false}
          selectable={false}
          dayMaxEvents
          slotLabelFormat={{ hour: "numeric", meridiem: "short" }}
          nowIndicator
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
          height="100%"
        />
      </div>
      <CalendarEventReadonlyDialog userId={userId} />
    </div>
  );
}
