import { create } from "zustand";
import type { UpdateCalendarEventInput } from "@/schedule/models/calendarEventDto";

type RecurringConfirmMode = "edit" | "delete";
export type RecurringConfirmResult = "canceled" | "confirmed";

type OpenProps =
  | {
      mode: "edit";
      eventId: string;
      instanceStart: Date;
      pendingUpdate: UpdateCalendarEventInput;
    }
  | {
      mode: "delete";
      eventId: string;
      instanceStart: Date;
    };

type RecurringConfirmDialogState = {
  opened: boolean;
  mode: RecurringConfirmMode;
  eventId: string;
  instanceStart: Date | null;
  pendingUpdate: UpdateCalendarEventInput | null;
  resolver: ((result: RecurringConfirmResult) => void) | null;
  open: (props: OpenProps) => Promise<RecurringConfirmResult>;
  close: () => void;
  confirm: () => void;
};

const resetState = {
  opened: false,
  eventId: "",
  instanceStart: null,
  pendingUpdate: null,
  resolver: null,
};

export const useRecurringConfirmDialogStore =
  create<RecurringConfirmDialogState>((set, get) => ({
    opened: false,
    mode: "edit",
    eventId: "",
    instanceStart: null,
    pendingUpdate: null,
    resolver: null,
    open: (props) => {
      return new Promise<RecurringConfirmResult>((resolve) => {
        set({
          opened: true,
          mode: props.mode,
          eventId: props.eventId,
          instanceStart: props.instanceStart,
          pendingUpdate: props.mode === "edit" ? props.pendingUpdate : null,
          resolver: resolve,
        });
      });
    },
    close: () => {
      get().resolver?.("canceled");
      set(resetState);
    },
    confirm: () => {
      get().resolver?.("confirmed");
      set(resetState);
    },
  }));
