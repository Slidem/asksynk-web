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
}

export function AttentionItemStatusBadge({ status }: Props) {
  return (
    <Badge size="sm" variant="light" color={COLORS[status]}>
      {LABELS[status]}
    </Badge>
  );
}
