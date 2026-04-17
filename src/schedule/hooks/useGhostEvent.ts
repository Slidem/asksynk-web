import { useCallback, useEffect } from "react";
import { GHOST_EVENT_ID } from "../models/calendarEvent";
import { useCalendarEventDialogStore } from "../store/calendarEventDialogStore";
import { useGhostEventStore } from "../store/ghostEventStore";

/**
 * Custom hook to manage the ghost event in the schedule calendar.
 * The ghost event is a temporary event used for visual feedback during event creation or dragging.
 * This hook provides a function to create a ghost event and automatically clears it when the event dialog is closed.
 */
export const useGhostEvent = () => {
  const setGhostEvent = useGhostEventStore((s) => s.setGhostEvent);
  const clearGhostEvent = useGhostEventStore((s) => s.clearGhostEvent);

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

  const createGhostEvent = useCallback(
    (start: Date, end: Date) => {
      clearGhostEvent();

      const eventDurationSeconds = Math.round(
        (end.getTime() - start.getTime()) / 1000,
      );

      setGhostEvent({
        id: GHOST_EVENT_ID,
        eventId: GHOST_EVENT_ID,
        title: "",
        start: start,
        end: end,
        rrule: null,
        durationSeconds: eventDurationSeconds,
        instanceStart: start,
      });
    },
    [setGhostEvent, clearGhostEvent],
  );

  return createGhostEvent;
};
