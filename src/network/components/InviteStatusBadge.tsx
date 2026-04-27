import { Badge } from "@mantine/core";
import type { InviteStatus } from "@/network/models/invite";

const COLOR: Record<InviteStatus, string> = {
  pending: "yellow",
  accepted: "green",
  rejected: "gray",
};

const LABEL: Record<InviteStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

interface Props {
  status: InviteStatus;
}

export function InviteStatusBadge({ status }: Props) {
  return (
    <Badge color={COLOR[status]} variant="light">
      {LABEL[status]}
    </Badge>
  );
}
