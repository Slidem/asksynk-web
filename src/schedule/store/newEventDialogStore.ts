import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type NewEventDialogState = {
  opened: boolean;
  start: Date | null;
  end: Date | null;
  open: (start: Date, end: Date) => void;
  close: () => void;
};

export const useNewEventDialogStore = create<NewEventDialogState>()(
  subscribeWithSelector((set) => ({
    opened: false,
    start: null,
    end: null,
    open: (start, end) => set({ opened: true, start, end }),
    close: () => {
      set({ opened: false, start: null, end: null });
    },
  })),
);
