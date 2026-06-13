import { useTaskBatchDetailDialogStore } from "@/tasks/store/taskBatchDetailDialogStore";
import { useShallow } from "zustand/shallow";

export const useTaskBatchDetailDialogHandlers = () => {
  return useTaskBatchDetailDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsTaskBatchDetailDialogOpened = () => {
  return useTaskBatchDetailDialogStore((state) => state.opened);
};

export const useTaskBatchDetailDialogBatchId = () => {
  return useTaskBatchDetailDialogStore((state) => state.batchId);
};
