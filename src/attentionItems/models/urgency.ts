import {
  IconAlertTriangle,
  IconBolt,
  IconCalendarTime,
  IconCircleCheck,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

export type AttentionUrgency =
  | "overdue"
  | "urgent"
  | "now"
  | "upcoming"
  | "later"
  | "resolved";

export const URGENCY_ORDER: readonly AttentionUrgency[] = [
  "overdue",
  "urgent",
  "now",
  "upcoming",
  "later",
  "resolved",
] as const;

export const URGENCY_LABELS: Record<AttentionUrgency, string> = {
  overdue: "Overdue",
  urgent: "Urgent",
  now: "Now",
  upcoming: "Upcoming",
  later: "Later",
  resolved: "Resolved",
};

export const URGENCY_COLORS: Record<AttentionUrgency, string> = {
  overdue: "red",
  urgent: "orange",
  now: "blue",
  upcoming: "yellow",
  later: "gray",
  resolved: "teal",
};

export const URGENCY_ICONS: Record<AttentionUrgency, Icon> = {
  overdue: IconAlertTriangle,
  urgent: IconBolt,
  now: IconPlayerPlay,
  upcoming: IconClock,
  later: IconCalendarTime,
  resolved: IconCircleCheck,
};
