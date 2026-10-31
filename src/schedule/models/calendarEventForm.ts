import type { DateValue } from "@mantine/dates";

export type CalendarEventFormValues = {
  title: string;
  description: string;
  location: string;
  link: string;
  color: string;
  // Mantine DateTimePicker emits local "YYYY-MM-DD HH:mm:ss" strings on change
  start: DateValue;
  end: DateValue;
  tagIds: string[];
  recurrence: string;
};

export const RECURRENCE_OPTIONS = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
] as const;

export const DEFAULT_FORM_VALUES: CalendarEventFormValues = {
  title: "",
  description: "",
  location: "",
  link: "",
  color: "#4285f4",
  start: null,
  end: null,
  tagIds: [],
  recurrence: "",
};
