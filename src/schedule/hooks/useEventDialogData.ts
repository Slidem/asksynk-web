import { useShallow } from "zustand/shallow";
import type { CalendarEvent } from "../models/calendarEvent";
import { useCalendarEventDialogStore } from "../store/calendarEventDialogStore";

type CalendarEventDialogState = ReturnType<
  typeof useCalendarEventDialogStore.getState
>;

type CalendarEventDialogData = {
  opened: boolean;
  mode: "create" | "edit";
  openedEvent: CalendarEvent | null;
};

const selectCalendarEventDialogData = (
  state: CalendarEventDialogState,
): CalendarEventDialogData => ({
  opened: state.opened,
  mode: state.mode,
  openedEvent: state.openedEvent,
});

export function useEventDialogData(): CalendarEventDialogData;
export function useEventDialogData<T>(
  sliceFn: (state: CalendarEventDialogState) => T,
): T;
export function useEventDialogData(
  sliceFn?: (state: CalendarEventDialogState) => unknown,
) {
  return useCalendarEventDialogStore(
    useShallow((state: CalendarEventDialogState) =>
      sliceFn ? sliceFn(state) : selectCalendarEventDialogData(state),
    ),
  );
}
