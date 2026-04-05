import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventDropArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import type { DatesSetArg } from "@fullcalendar/core";
import { Paper } from "@mantine/core";

import { GHOST_EVENT_ID } from "@/schedule/models/event";
import { useNewEventDialogStore } from "@/schedule/store/newEventDialogStore";
import { useScheduleStore } from "@/schedule/store/scheduleStore";
import { ScheduleToolbar } from "./ScheduleToolbar";
import classes from "./ScheduleCalendar.module.css";

export function ScheduleCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const [title, setTitle] = useState("");

  const openDialog = useNewEventDialogStore((s) => s.open);
  const events = useScheduleStore((s) => s.events);
  const addEvent = useScheduleStore((s) => s.addEvent);
  const removeEvent = useScheduleStore((s) => s.removeEvent);
  const updateEvent = useScheduleStore((s) => s.updateEvent);
  const currentView = useScheduleStore((s) => s.currentView);

  useEffect(() => {
    useNewEventDialogStore.subscribe(
      (state) => state.opened,
      (opened, previouslyOpened) => {
        if (previouslyOpened && !opened) {
          removeEvent(GHOST_EVENT_ID);
        }
      },
    );
  }, [removeEvent]);

  const handleSelect = (arg: DateSelectArg) => {
    removeEvent(GHOST_EVENT_ID);
    addEvent({
      id: GHOST_EVENT_ID,
      title: "",
      start: arg.start.toISOString(),
      end: arg.end.toISOString(),
    });
    openDialog(arg.start, arg.end);
    calendarRef.current?.getApi().unselect();
  };

  const handleEventDrop = (arg: EventDropArg) => {
    updateEvent(arg.event.id, {
      start: arg.event.startStr,
      end: arg.event.endStr,
    });
  };

  const handleEventResize = (arg: EventResizeDoneArg) => {
    updateEvent(arg.event.id, {
      start: arg.event.startStr,
      end: arg.event.endStr,
    });
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    setTitle(arg.view.title);
  };

  return (
    <Paper radius="lg" p="md" withBorder className={classes.wrapper}>
      <ScheduleToolbar calendarRef={calendarRef} title={title} />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        headerToolbar={false}
        events={events}
        editable
        selectable
        selectMirror
        dayMaxEvents
        nowIndicator
        eventClassNames={(arg) =>
          arg.event.id === GHOST_EVENT_ID ? ["fc-event-mirror"] : []
        }
        select={handleSelect}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        datesSet={handleDatesSet}
        height="auto"
      />
    </Paper>
  );
}
