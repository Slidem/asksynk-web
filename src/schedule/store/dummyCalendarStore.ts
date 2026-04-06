import { create } from "zustand";
import { DUMMY_EVENTS, type CalendarEvent } from "../models/calendarEvent";

interface Props {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
}

export const useDummyCalendarStore = create<Props>((set) => {
  const events: CalendarEvent[] = DUMMY_EVENTS;

  const addEvent = (event: CalendarEvent) => {
    set((state) => ({ events: [...state.events, event] }));
  };

  const removeEvent = (id: string) => {
    set((state) => ({ events: state.events.filter((e) => e.id !== id) }));
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    set((state) => {
      const index = state.events.findIndex((e) => e.id === id);
      if (index !== -1) {
        const newEvents = [...state.events];
        newEvents[index] = { ...newEvents[index], ...updates };
        return { events: newEvents };
      }
      return state;
    });
  };

  return { events, addEvent, removeEvent, updateEvent };
});
