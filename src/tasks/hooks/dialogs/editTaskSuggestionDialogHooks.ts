import type { TaskSuggestion } from "@/tasks/models/taskSuggestion";
import { useEditTaskSuggestionDialogStore } from "@/tasks/store/editTaskSuggestionDialogStore";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

export const useEditTaskSuggestionDialogHandlers = () => {
  return useEditTaskSuggestionDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsEditTaskSuggestionDialogOpened = () => {
  return useEditTaskSuggestionDialogStore((state) => state.opened);
};

export const useOpenedEditSuggestion = () => {
  return useEditTaskSuggestionDialogStore((state) => state.selectedSuggestion);
};

export const useOnSelectedEditSuggestionChange = (
  callback: (suggestion: TaskSuggestion | null) => void,
) => {
  const callBackRef = useRef(callback);
  useEffect(() => {
    const unsubscribe = useEditTaskSuggestionDialogStore.subscribe(
      (state) => state.selectedSuggestion,
      (selectedSuggestion) => {
        callBackRef.current(selectedSuggestion);
      },
    );
    return unsubscribe;
  }, []);
};
