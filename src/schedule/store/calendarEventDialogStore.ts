import { createTempId } from "@/lib/id";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { CalendarEvent } from "../models/calendarEvent";

type OpenedEvent = Omit<Partial<CalendarEvent>, "id" | "start" | "end"> & {
  id: string;
  start: Date;
  end: Date;
};

type OpenDialogWithAction = {
  actionText: string;
  onAction: (event: CalendarEvent) => void;
};

type OpenDialogProps =
  | ({
      mode: "create";
      actionText: "Create";
      start: Date;
      end: Date;
    } & OpenDialogWithAction)
  | ({
      mode: "edit";
      actionText: "Update";
      event: CalendarEvent;
    } & OpenDialogWithAction);

type NewEventDialogState = {
  opened: boolean;
  openedEvent: OpenedEvent | null;
  actionText: string;
  onAction: (event: CalendarEvent) => void;
  open: (openProps: OpenDialogProps) => void;
  close: () => void;
};

export const useCalendarEventDialogStore = create<NewEventDialogState>()(
  subscribeWithSelector((set) => ({
    opened: false,
    openedEvent: null,
    actionText: "Create",
    onAction: () => {},
    open: (openProps) => {
      let openedEvent: OpenedEvent | null = null;

      if (openProps.mode === "edit") {
        openedEvent = openProps.event;
      } else {
        openedEvent = {
          id: createTempId(),
          title: "",
          start: openProps.start,
          end: openProps.end,
        };
      }

      set({
        opened: true,
        openedEvent: openedEvent,
        actionText: openProps.actionText,
        onAction: openProps.onAction,
      });
    },
    close: () => {
      set({
        opened: false,
        openedEvent: null,
        actionText: "Create",
        onAction: () => {},
      });
    },
  })),
);
