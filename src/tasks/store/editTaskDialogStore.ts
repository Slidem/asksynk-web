import type { TaskDto } from "@/tasks/models/task";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface Props {
  selectedTask: TaskDto | null;
  opened: boolean;
  open: (task: TaskDto) => void;
  close: () => void;
}

export const useEditTaskDialogStore = create<Props>()(
  subscribeWithSelector((set) => ({
    selectedTask: null,
    opened: false,
    open: (task: TaskDto) => set({ selectedTask: task, opened: true }),
    close: () => set({ selectedTask: null, opened: false }),
  })),
);
