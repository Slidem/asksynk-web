import { createTempId } from "@/lib/id";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";

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
  openedEvent: CalendarEvent | null;
  open: (props: OpenDialogProps) => void;
  close: () => void;
};

export const useCalendarEventDialogStore = create<CalendarEventDialogState>()(
  subscribeWithSelector((set) => ({
    opened: false,
    mode: "create",
    openedEvent: null,
    open: (props) => {
      let openedEvent: CalendarEvent;

      if (props.mode === "edit") {
        const durationSeconds = Math.floor(
          (props.event.end.getTime() - props.event.start.getTime()) / 1000,
        );

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
          durationSeconds,
          instanceStart: props.event.instanceStart,
        };
      } else {
        const tempId = createTempId();
        const durationSeconds = Math.floor(
          (props.end.getTime() - props.start.getTime()) / 1000,
        );
        openedEvent = {
          id: tempId,
          eventId: tempId,
          title: "",
          start: props.start,
          end: props.end,
          rrule: null,
          durationSeconds,
          instanceStart: props.start,
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
