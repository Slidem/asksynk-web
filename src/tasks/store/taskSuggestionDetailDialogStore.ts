import { create } from "zustand";

import type {
  SuggestionRole,
  TaskSuggestion,
} from "@/tasks/models/taskSuggestion";

interface Props {
  suggestion: TaskSuggestion | null;
  role: SuggestionRole;
  opened: boolean;
  open: (suggestion: TaskSuggestion, role: SuggestionRole) => void;
  close: () => void;
}

// Read-only view of a suggestion's full details (title, description, tags,
// subtasks). Role decides who the counterparty is.
export const useTaskSuggestionDetailDialogStore = create<Props>((set) => ({
  suggestion: null,
  role: "received",
  opened: false,
  open: (suggestion, role) => set({ suggestion, role, opened: true }),
  close: () => set({ suggestion: null, opened: false }),
}));
