import { usePublicViewGuestsDialogStore } from "@/public-views/store/publicViewGuestsDialogStore";
import { useShallow } from "zustand/shallow";

export const usePublicViewGuestsDialogHandlers = () => {
  return usePublicViewGuestsDialogStore(
    useShallow((s) => ({ open: s.open, close: s.close })),
  );
};

export const useSelectedGuestsPublicViewId = () => {
  return usePublicViewGuestsDialogStore((s) => s.publicViewId);
};
