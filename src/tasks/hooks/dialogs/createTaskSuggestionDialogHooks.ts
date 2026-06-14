import type { CreateTaskSuggestionPreset } from "@/tasks/store/createTaskSuggestionDialogStore";
import { useCreateTaskSuggestionDialogStore } from "@/tasks/store/createTaskSuggestionDialogStore";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

export const useCreateTaskSuggestionDialogHandlers = () => {
  return useCreateTaskSuggestionDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsCreateTaskSuggestionDialogOpened = () => {
  return useCreateTaskSuggestionDialogStore((state) => state.opened);
};

export const useOnCreateSuggestionPresetChange = (
  callback: (preset: CreateTaskSuggestionPreset | null) => void,
) => {
  const callBackRef = useRef(callback);
  useEffect(() => {
    const unsubscribe = useCreateTaskSuggestionDialogStore.subscribe(
      (state) => state.preset,
      (preset) => {
        callBackRef.current(preset);
      },
    );
    return unsubscribe;
  }, []);
};
