import { useShallow } from "zustand/shallow";
import { useRecurringConfirmDialogStore } from "../store/recurringConfirmDialogStore";

export const useManageRecurringEventDialog = () => {
  return useRecurringConfirmDialogStore(
    useShallow((s) => ({
      open: s.open,
      close: s.close,
      confirm: s.confirm,
    })),
  );
};
