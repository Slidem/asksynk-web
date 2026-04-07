import { createTempId } from "@/lib/id";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";

type OpenedEvent = {
  id: string;
  eventId: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  link?: string;
  color?: string;
  tagIds?: string[];
  rrule: string | null;
  instanceStart: string;
};

type OpenDialogProps =
  | {
      mode: "create";
      start: Date;
      end: Date;
    }
  | {
      mode: "edit";
      event: CalendarEvent;
    };

type CalendarEventDialogState = {
  opened: boolean;
  mode: "create" | "edit";
  openedEvent: OpenedEvent | null;
  open: (props: OpenDialogProps) => void;
  close: () => void;
};

export const useCalendarEventDialogStore = create<CalendarEventDialogState>()(
  subscribeWithSelector((set) => ({
    opened: false,
    mode: "create",
    openedEvent: null,
    open: (props) => {
      let openedEvent: OpenedEvent;

      if (props.mode === "edit") {
        openedEvent = {
          id: props.event.id,
          eventId: props.event.eventId,
          title: props.event.title,
          start: props.event.start,
          end: props.event.end,
          description: props.event.description,
          location: props.event.location,
          link: props.event.link,
          color: props.event.color,
          tagIds: props.event.tagIds,
          rrule: props.event.rrule,
          instanceStart: props.event.instanceStart,
        };
      } else {
        const tempId = createTempId();
        openedEvent = {
          id: tempId,
          eventId: tempId,
          title: "",
          start: props.start,
          end: props.end,
          rrule: null,
          instanceStart: props.start.toISOString(),
        };
      }

      set({
        opened: true,
        mode: props.mode,
        openedEvent,
      });
    },
    close: () => {
      set({
        opened: false,
        openedEvent: null,
      });
    },
  })),
);
