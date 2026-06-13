import { useCreateTaskBatchDialogStore } from "@/tasks/store/createTaskBatchDialogStore";
import { useShallow } from "zustand/shallow";

export const useCreateTaskBatchDialogHandlers = () => {
  return useCreateTaskBatchDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsCreateTaskBatchDialogOpened = () => {
  return useCreateTaskBatchDialogStore((state) => state.opened);
};
