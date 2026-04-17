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
import { useRef } from "react";

import { useUpdateCalendarEventMutation } from "@/schedule/hooks/mutations";
import { useCalendarEvents } from "@/schedule/hooks/useCalendarEvents";
import { useOpenEditEventDialog } from "@/schedule/hooks/useOpenEditEventDialog";
import { useOpenNewEventDialog } from "@/schedule/hooks/useOpenNewEventDialog";
import {
  GHOST_EVENT_ID,
  type CalendarEvent,
} from "@/schedule/models/calendarEvent";
import { formToUpdateInput } from "@/schedule/utils/calendarEventMapper";
import { useGhostEvent } from "../hooks/useGhostEvent";
import { useManageRecurringEventDialog } from "../hooks/useManageRecurringEventDialog";
import { useManageScheduleView } from "../hooks/useManageScheduleView";
import { useScheduleView } from "../hooks/useScheduleView";
import classes from "./ScheduleCalendar.module.css";
import { ScheduleToolbar } from "./ScheduleToolbar";

export function ScheduleCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const openNewEventDialog = useOpenNewEventDialog();
  const openEditEventDialog = useOpenEditEventDialog();
  const events = useCalendarEvents();
  const createGhostEvent = useGhostEvent();
  const updateMutation = useUpdateCalendarEventMutation();
  const { open: openRecurringConfirm } = useManageRecurringEventDialog();
  const { currentView } = useScheduleView();
  const { setViewRange, setCalendarTitle } = useManageScheduleView();

  const handleSelect = (arg: DateSelectArg) => {
    createGhostEvent(arg.start, arg.end);
    openNewEventDialog(arg.start, arg.end);
    calendarRef.current?.getApi().unselect();
  };

  const handleEventDrop = async (arg: EventDropArg) => {
    const event = events.find((e) => e.id === arg.event.id);
    if (!event) {
      return;
    }
    const newStart = arg.event.start;
    const newEnd = arg.event.end;

    if (!newStart || !newEnd) {
      return;
    }

    if (event.rrule) {
      const result = await openRecurringConfirm({
        mode: "edit",
        eventId: event.eventId,
        instanceStart: event.instanceStart,
        pendingUpdate: formToUpdateInput({
          start: newStart,
          end: newEnd,
        }),
      });
      if (result === "canceled") arg.revert();
    } else {
      updateMutation.mutate({
        eventId: event.eventId,
        update: formToUpdateInput({ start: newStart, end: newEnd }),
      });
    }
  };

  const handleEventResize = async (arg: EventResizeDoneArg) => {
    const event = events.find((e) => e.id === arg.event.id);

    if (!event) {
      return;
    }

    const newStart = arg.event.start;
    const newEnd = arg.event.end;

    if (!newStart || !newEnd) {
      return;
    }

    if (event.rrule) {
      const result = await openRecurringConfirm({
        mode: "edit",
        eventId: event.eventId,
        instanceStart: event.instanceStart,
        pendingUpdate: formToUpdateInput({
          start: newStart,
          end: newEnd,
        }),
      });
      if (result === "canceled") arg.revert();
    } else {
      updateMutation.mutate({
        eventId: event.eventId,
        update: formToUpdateInput({ start: newStart, end: newEnd }),
      });
    }
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    setCalendarTitle(arg.view.title);
    setViewRange(arg.start, arg.end);
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
