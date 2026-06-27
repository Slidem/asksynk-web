import { useShallow } from "zustand/shallow";

import { useTaskSuggestionDetailDialogStore } from "@/tasks/store/taskSuggestionDetailDialogStore";

export const useTaskSuggestionDetailDialogHandlers = () => {
  return useTaskSuggestionDetailDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsTaskSuggestionDetailDialogOpened = () => {
  return useTaskSuggestionDetailDialogStore((state) => state.opened);
};

export const useDetailSuggestion = () => {
  return useTaskSuggestionDetailDialogStore(
    useShallow((state) => ({
      suggestion: state.suggestion,
      role: state.role,
    })),
  );
};
