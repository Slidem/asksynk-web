import { Badge } from "@mantine/core";

import type { IntegrationStatus } from "@/integrations/models/calendarIntegration";

const STATUS_CONFIG: Record<
  IntegrationStatus,
  { color: string; label: string }
> = {
  active: { color: "green", label: "Connected" },
  error: { color: "red", label: "Needs attention" },
  revoked: { color: "gray", label: "Revoked" },
};

export function IntegrationStatusBadge({
  status,
}: {
  status: IntegrationStatus;
}) {
  const { color, label } = STATUS_CONFIG[status];
  return (
    <Badge color={color} variant="light" radius="sm">
      {label}
    </Badge>
  );
}
