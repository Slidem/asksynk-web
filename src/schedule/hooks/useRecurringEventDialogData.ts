import { useShallow } from "zustand/shallow";
import { useRecurringConfirmDialogStore } from "../store/recurringConfirmDialogStore";

export const useRecurringEventDialogData = () => {
  return useRecurringConfirmDialogStore(
    useShallow((s) => ({
      opened: s.opened,
      mode: s.mode,
      eventId: s.eventId,
      instanceStart: s.instanceStart,
      pendingUpdate: s.pendingUpdate,
    })),
  );
};
