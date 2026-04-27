import { useInviteDialogStore } from "@/network/store/inviteDialogStore";
import { useShallow } from "zustand/shallow";

export const useInviteDialogHandlers = () => {
  return useInviteDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsInviteDialogOpened = () => {
  return useInviteDialogStore((state) => state.opened);
};
