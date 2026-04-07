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

import { useUpdateCalendarEventMutation } from "@/schedule/hooks/mutations";
import { useCalendarEvents } from "@/schedule/hooks/useCalendarEvents";
import { useOpenEditEventDialog } from "@/schedule/hooks/useOpenEditEventDialog";
import { useOpenNewEventDialog } from "@/schedule/hooks/useOpenNewEventDialog";
import {
  GHOST_EVENT_ID,
  type CalendarEvent,
} from "@/schedule/models/calendarEvent";
import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";
import { useGhostEventStore } from "@/schedule/store/ghostEventStore";
import { useRecurringConfirmDialogStore } from "@/schedule/store/recurringConfirmDialogStore";
import { useScheduleStore } from "@/schedule/store/scheduleStore";
import { formToUpdateInput } from "@/schedule/utils/calendarEventMapper";
import classes from "./ScheduleCalendar.module.css";
import { ScheduleToolbar } from "./ScheduleToolbar";

export function ScheduleCalendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const openNewEventDialog = useOpenNewEventDialog();
  const openEditEventDialog = useOpenEditEventDialog();
  const events = useCalendarEvents();
  const setGhostEvent = useGhostEventStore((s) => s.setGhostEvent);
  const clearGhostEvent = useGhostEventStore((s) => s.clearGhostEvent);
  const setDateRange = useScheduleStore((s) => s.setViewRange);
  const updateMutation = useUpdateCalendarEventMutation();
  const openRecurringConfirm = useRecurringConfirmDialogStore((s) => s.open);
  const currentView = useScheduleStore((s) => s.currentView);
  const setTitle = useScheduleStore((s) => s.setCalendarTitle);

  useEffect(() => {
    const unsubscribe = useCalendarEventDialogStore.subscribe(
      (state) => state.opened,
      (opened, previouslyOpened) => {
        if (previouslyOpened && !opened) {
          clearGhostEvent();
        }
      },
    );
    return () => unsubscribe();
  }, [clearGhostEvent]);

  const handleSelect = (arg: DateSelectArg) => {
    clearGhostEvent();
    setGhostEvent({
      id: GHOST_EVENT_ID,
      eventId: GHOST_EVENT_ID,
      title: "",
      start: arg.start,
      end: arg.end,
      rrule: null,
      durationSeconds: Math.round(
        (arg.end.getTime() - arg.start.getTime()) / 1000,
      ),
      instanceStart: arg.start.toISOString(),
    });
    openNewEventDialog(arg.start, arg.end);
    calendarRef.current?.getApi().unselect();
  };

  const handleEventDrop = (arg: EventDropArg) => {
    const event = events.find((e) => e.id === arg.event.id);
    if (!event) return;
    const newStart = arg.event.start;
    const newEnd = arg.event.end;
    if (!newStart || !newEnd) return;

    if (event.rrule) {
      openRecurringConfirm({
        mode: "edit",
        eventId: event.eventId,
        instanceStart: event.instanceStart,
        pendingUpdate: formToUpdateInput({
          start: newStart,
          end: newEnd,
        }),
      });
    } else {
      updateMutation.mutate({
        eventId: event.eventId,
        update: formToUpdateInput({ start: newStart, end: newEnd }),
      });
    }
  };

  const handleEventResize = (arg: EventResizeDoneArg) => {
    const event = events.find((e) => e.id === arg.event.id);
    if (!event) return;
    const newStart = arg.event.start;
    const newEnd = arg.event.end;
    if (!newStart || !newEnd) return;

    if (event.rrule) {
      openRecurringConfirm({
        mode: "edit",
        eventId: event.eventId,
        instanceStart: event.instanceStart,
        pendingUpdate: formToUpdateInput({
          start: newStart,
          end: newEnd,
        }),
      });
    } else {
      updateMutation.mutate({
        eventId: event.eventId,
        update: formToUpdateInput({ start: newStart, end: newEnd }),
      });
    }
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    setTitle(arg.view.title);
    setDateRange(arg.start, arg.end);
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
