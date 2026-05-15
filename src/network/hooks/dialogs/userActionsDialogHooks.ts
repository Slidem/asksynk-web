import { useShallow } from "zustand/shallow";

import { useUserActionsDialogStore } from "@/network/store/userActionsDialogStore";

export const useUserActionsDialog = () => {
  return useUserActionsDialogStore(
    useShallow((s) => ({ opened: s.opened, user: s.user })),
  );
};

export const useUserActionsDialogHandlers = () => {
  return useUserActionsDialogStore(
    useShallow((s) => ({ open: s.open, close: s.close })),
  );
};
