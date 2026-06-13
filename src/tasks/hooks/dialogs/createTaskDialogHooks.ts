import { useCreateTaskDialogStore } from "@/tasks/store/createTaskDialogStore";
import { useShallow } from "zustand/shallow";

export const useCreateTaskDialogHandlers = () => {
  return useCreateTaskDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsCreateTaskDialogOpened = () => {
  return useCreateTaskDialogStore((state) => state.opened);
};

export const useCreateTaskPresetBatchId = () => {
  return useCreateTaskDialogStore((state) => state.presetBatchId);
};
