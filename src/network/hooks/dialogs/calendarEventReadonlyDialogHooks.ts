import { useShallow } from "zustand/shallow";

import { useCalendarEventReadonlyDialogStore } from "@/network/store/calendarEventReadonlyDialogStore";

export const useCalendarEventReadonlyDialog = () => {
  return useCalendarEventReadonlyDialogStore(
    useShallow((s) => ({ opened: s.opened, event: s.event })),
  );
};

export const useCalendarEventReadonlyDialogHandlers = () => {
  return useCalendarEventReadonlyDialogStore(
    useShallow((s) => ({ open: s.open, close: s.close })),
  );
};
