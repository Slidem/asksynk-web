import { Badge } from "@mantine/core";

import type { SuggestionStatus } from "@/tasks/models/taskSuggestion";

const COLOR: Record<SuggestionStatus, string> = {
  pending: "yellow",
  accepted: "green",
  rejected: "gray",
};

const LABEL: Record<SuggestionStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

interface Props {
  status: SuggestionStatus;
}

export function SuggestionStatusBadge({ status }: Props) {
  return (
    <Badge color={COLOR[status]} variant="light">
      {LABEL[status]}
    </Badge>
  );
}
