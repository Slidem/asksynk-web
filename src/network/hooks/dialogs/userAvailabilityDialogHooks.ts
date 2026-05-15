import { useShallow } from "zustand/shallow";

import { useUserAvailabilityDialogStore } from "@/network/store/userAvailabilityDialogStore";

export const useUserAvailabilityDialog = () => {
  return useUserAvailabilityDialogStore(
    useShallow((s) => ({ opened: s.opened, user: s.user })),
  );
};

export const useUserAvailabilityDialogHandlers = () => {
  return useUserAvailabilityDialogStore(
    useShallow((s) => ({ open: s.open, close: s.close })),
  );
};
