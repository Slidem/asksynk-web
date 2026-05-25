export type AttentionUrgency =
  | "overdue"
  | "urgent"
  | "now"
  | "upcoming"
  | "later";

export const URGENCY_ORDER: readonly AttentionUrgency[] = [
  "overdue",
  "urgent",
  "now",
  "upcoming",
  "later",
] as const;

export const URGENCY_LABELS: Record<AttentionUrgency, string> = {
  overdue: "Overdue",
  urgent: "Urgent",
  now: "Now",
  upcoming: "Upcoming",
  later: "Later",
};

export const URGENCY_COLORS: Record<AttentionUrgency, string> = {
  overdue: "red",
  urgent: "orange",
  now: "blue",
  upcoming: "yellow",
  later: "gray",
};
