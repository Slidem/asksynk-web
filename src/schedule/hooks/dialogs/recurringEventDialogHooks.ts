import { useShallow } from "zustand/shallow";

import { useRecurringConfirmDialogStore } from "@/schedule/store/recurringConfirmDialogStore";

export const useManageRecurringEventDialog = () => {
  return useRecurringConfirmDialogStore(
    useShallow((s) => ({
      open: s.open,
      close: s.close,
      confirm: s.confirm,
    })),
  );
};

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
