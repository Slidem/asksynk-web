import { useShallow } from "zustand/shallow";

import { useUserActionsDialogStore } from "@/network/store/userActionsDialogStore";

export const useUserActionsDialogHandlers = () => {
  return useUserActionsDialogStore(
    useShallow((s) => ({ open: s.open, close: s.close })),
  );
};
