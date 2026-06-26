import { Badge } from "@mantine/core";
import type { AttentionItemStatus } from "@/attentionItems/models/attentionItem";

const LABELS: Record<AttentionItemStatus, string> = {
  created: "New",
  in_progress: "In progress",
  resolved: "Resolved",
};

const COLORS: Record<AttentionItemStatus, string> = {
  created: "gray",
  in_progress: "blue",
  resolved: "green",
};

interface Props {
  status: AttentionItemStatus;
  /** Override the pill default to line up with squared chips (e.g. in messages). */
  radius?: string;
}

export function AttentionItemStatusBadge({ status, radius }: Props) {
  return (
    <Badge size="sm" radius={radius} variant="light" color={COLORS[status]}>
      {LABELS[status]}
    </Badge>
  );
}
