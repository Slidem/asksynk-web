import { useNewThreadDialogStore } from "@/messages/store/newThreadDialogStore";
import { useShallow } from "zustand/shallow";

export const useNewThreadDialogHandlers = () => {
  return useNewThreadDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsNewThreadDialogOpened = () => {
  return useNewThreadDialogStore((state) => state.opened);
};
