import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface CreateTaskSuggestionPreset {
  suggesteeUserId?: string;
  tagIds?: string[];
}

interface Props {
  opened: boolean;
  preset: CreateTaskSuggestionPreset | null;
  open: (preset?: CreateTaskSuggestionPreset) => void;
  close: () => void;
}

export const useCreateTaskSuggestionDialogStore = create<Props>()(
  subscribeWithSelector((set) => ({
    opened: false,
    preset: null,
    open: (preset = {}) => set({ opened: true, preset }),
    close: () => set({ opened: false, preset: null }),
  })),
);
