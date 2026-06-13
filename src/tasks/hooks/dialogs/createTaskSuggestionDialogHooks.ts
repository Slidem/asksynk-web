import { useCreateTaskSuggestionDialogStore } from "@/tasks/store/createTaskSuggestionDialogStore";
import { useShallow } from "zustand/shallow";

export const useCreateTaskSuggestionDialogHandlers = () => {
  return useCreateTaskSuggestionDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsCreateTaskSuggestionDialogOpened = () => {
  return useCreateTaskSuggestionDialogStore((state) => state.opened);
};
