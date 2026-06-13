import type { TaskSuggestion } from "@/tasks/models/taskSuggestion";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface Props {
  selectedSuggestion: TaskSuggestion | null;
  opened: boolean;
  open: (suggestion: TaskSuggestion) => void;
  close: () => void;
}

export const useEditTaskSuggestionDialogStore = create<Props>()(
  subscribeWithSelector((set) => ({
    selectedSuggestion: null,
    opened: false,
    open: (suggestion) => set({ selectedSuggestion: suggestion, opened: true }),
    close: () => set({ selectedSuggestion: null, opened: false }),
  })),
);
