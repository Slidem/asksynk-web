import { useCreateTagDialogStore } from "@/tags/store/createTagDialogStore";
import { useShallow } from "zustand/shallow";

export const useCreateTagDialogHandlers = () => {
  return useCreateTagDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsCreateTagDialogOpened = () => {
  return useCreateTagDialogStore((state) => state.opened);
};
