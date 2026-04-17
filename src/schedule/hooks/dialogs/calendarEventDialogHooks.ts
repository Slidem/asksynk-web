import { useShallow } from "zustand/shallow";

import type { CalendarEvent } from "@/schedule/models/calendarEvent";
import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";

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

export const useCloseEventDialog = () => {
  return useCalendarEventDialogStore((s) => s.close);
};

export function useOpenEditEventDialog() {
  const open = useCalendarEventDialogStore((s) => s.open);

  return (event: CalendarEvent) => {
    open({ mode: "edit", event });
  };
}

export function useOpenNewEventDialog() {
  const open = useCalendarEventDialogStore((s) => s.open);

  return (start: Date, end: Date) => {
    open({ mode: "create", start, end });
  };
}
