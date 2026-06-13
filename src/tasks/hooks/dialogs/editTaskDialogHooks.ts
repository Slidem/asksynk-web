import type { TaskDto } from "@/tasks/models/task";
import { useEditTaskDialogStore } from "@/tasks/store/editTaskDialogStore";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

export const useEditTaskDialogHandlers = () => {
  return useEditTaskDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
};

export const useIsEditTaskDialogOpened = () => {
  return useEditTaskDialogStore((state) => state.opened);
};

export const useOpenedEditTask = () => {
  return useEditTaskDialogStore((state) => state.selectedTask);
};

export const useOnSelectedEditedTaskChange = (
  callback: (task: TaskDto | null) => void,
) => {
  const callBackRef = useRef(callback);
  useEffect(() => {
    const unsubscribe = useEditTaskDialogStore.subscribe(
      (state) => state.selectedTask,
      (selectedTask) => {
        callBackRef.current(selectedTask);
      },
    );
    return unsubscribe;
  }, []);
};
