import type {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventDropArg,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Paper } from "@mantine/core";
import { useEffect, useRef } from "react";

import {
  GHOST_EVENT_ID,
  type CalendarEvent,
} from "@/schedule/models/calendarEvent";
import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";
import { useScheduleStore } from "@/schedule/store/scheduleStore";
import { useAddCalendarEvent } from "../hooks/useAddCalendarEvent";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useOpenNewEventDialog } from "../hooks/useOpenNewEventDialog";
import { useOpenEditEventDialog } from "../hooks/useOpenEditEventDialog";
import { useRemoveCalendarEvent } from "../hooks/useRemoveCalendarEvent";
import { useUpdateCalendarEvent } from "../hooks/useUpdateCalendarEvent";
import classes from "./ScheduleCalendar.module.css";
import { ScheduleToolbar } from "./ScheduleToolbar";

export function ScheduleCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const openNewEventDialog = useOpenNewEventDialog();
  const openEditEventDialog = useOpenEditEventDialog();
  const events = useCalendarEvents();
  const addEvent = useAddCalendarEvent();
  const removeEvent = useRemoveCalendarEvent();
  const updateEvent = useUpdateCalendarEvent();
  const currentView = useScheduleStore((s) => s.currentView);
  const setTitle = useScheduleStore((s) => s.setCalendarTitle);

  useEffect(() => {
    const unsubscribe = useCalendarEventDialogStore.subscribe(
      (state) => state.opened,
      (opened, previouslyOpened) => {
        if (previouslyOpened && !opened) {
          removeEvent(GHOST_EVENT_ID);
        }
      },
    );
    return () => unsubscribe();
  }, [removeEvent]);

  const handleSelect = (arg: DateSelectArg) => {
    removeEvent(GHOST_EVENT_ID);
    addEvent({
      id: GHOST_EVENT_ID,
      title: "",
      start: arg.start,
      end: arg.end,
    });
    openNewEventDialog(arg.start, arg.end);
    calendarRef.current?.getApi().unselect();
  };

  const handleEventDrop = (arg: EventDropArg) => {
    updateEvent(arg.event.id, {
      start: arg.event.start ?? undefined,
      end: arg.event.end ?? undefined,
    });
  };

  const handleEventResize = (arg: EventResizeDoneArg) => {
    updateEvent(arg.event.id, {
      start: arg.event.start ?? undefined,
      end: arg.event.end ?? undefined,
    });
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    setTitle(arg.view.title);
  };

  const handleEventClick = (arg: EventClickArg): void => {
    const event: CalendarEvent | undefined = events.find(
      (e) => e.id === arg.event.id,
    );
    if (event) {
      openEditEventDialog(event);
    }
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
      <ScheduleToolbar calendarRef={calendarRef} />
      <div style={{ flex: 1, minHeight: 0 }}>
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
          slotLabelFormat={{ hour: "numeric", meridiem: "short" }}
          nowIndicator
          eventClassNames={(arg) =>
            arg.event.id === GHOST_EVENT_ID ? ["fc-event-mirror"] : []
          }
          select={handleSelect}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          eventResize={handleEventResize}
          datesSet={handleDatesSet}
          height="100%"
        />
      </div>
    </Paper>
  );
}
