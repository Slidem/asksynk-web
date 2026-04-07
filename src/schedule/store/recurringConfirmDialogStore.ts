import { create } from "zustand";
import type { UpdateCalendarEventInput } from "@/schedule/models/calendarEventDto";

type RecurringConfirmMode = "edit" | "delete";

type OpenProps =
  | {
      mode: "edit";
      eventId: string;
      instanceStart: string;
      pendingUpdate: UpdateCalendarEventInput;
    }
  | {
      mode: "delete";
      eventId: string;
      instanceStart: string;
    };

type RecurringConfirmDialogState = {
  opened: boolean;
  mode: RecurringConfirmMode;
  eventId: string;
  instanceStart: string;
  pendingUpdate: UpdateCalendarEventInput | null;
  open: (props: OpenProps) => void;
  close: () => void;
};

export const useRecurringConfirmDialogStore =
  create<RecurringConfirmDialogState>((set) => ({
    opened: false,
    mode: "edit",
    eventId: "",
    instanceStart: "",
    pendingUpdate: null,
    open: (props) => {
      set({
        opened: true,
        mode: props.mode,
        eventId: props.eventId,
        instanceStart: props.instanceStart,
        pendingUpdate: props.mode === "edit" ? props.pendingUpdate : null,
      });
    },
    close: () => {
      set({
        opened: false,
        eventId: "",
        instanceStart: "",
        pendingUpdate: null,
      });
    },
  }));
