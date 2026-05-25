import { Group, Text, Tooltip } from "@mantine/core";
import { IconCalendarTime } from "@tabler/icons-react";
import { useMemo } from "react";

interface Props {
  dueDate: string | null;
}

export function AttentionItemDueDate({ dueDate }: Props) {
  const label = useMemo(
    () => (dueDate ? formatRelative(new Date(dueDate)) : null),
    [dueDate],
  );

  if (!dueDate || !label) return null;

  return (
    <Tooltip label={new Date(dueDate).toLocaleString()}>
      <Group gap={4} wrap="nowrap">
        <IconCalendarTime size={12} color="var(--mantine-color-dimmed)" />
        <Text size="xs" c="dimmed">
          {label}
        </Text>
      </Group>
    </Tooltip>
  );
}

function formatRelative(date: Date): string {
  const diff = date.getTime() - Date.now();
  const absMs = Math.abs(diff);
  const minutes = Math.round(absMs / 60_000);
  const hours = Math.round(absMs / 3_600_000);
  const days = Math.round(absMs / (24 * 3_600_000));

  const future = diff >= 0;
  let value: string;
  if (minutes < 60) value = `${minutes}m`;
  else if (hours < 48) value = `${hours}h`;
  else value = `${days}d`;

  return future ? `in ${value}` : `${value} ago`;
}
