import { useCreatePublicViewDialogStore } from "@/public-views/store/createPublicViewDialogStore";
import { useShallow } from "zustand/shallow";

export const useCreatePublicViewDialogHandlers = () => {
  return useCreatePublicViewDialogStore(
    useShallow((s) => ({ open: s.open, close: s.close })),
  );
};

export const useIsCreatePublicViewDialogOpened = () => {
  return useCreatePublicViewDialogStore((s) => s.opened);
};
