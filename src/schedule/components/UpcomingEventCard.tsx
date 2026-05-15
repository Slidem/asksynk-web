import { Badge, Button, Group, Paper, Stack, Text } from "@mantine/core";
import {
  IconClock,
  IconLink,
  IconMapPin,
  IconMessage,
  IconRepeat,
} from "@tabler/icons-react";

import type { CalendarEvent } from "@/schedule/models/calendarEvent";
import { formatEventTime } from "@/schedule/utils/formatEventTime";
import type { TagDto } from "@/tags/models/tag";

const TAG_LIMIT = 3;

interface Props {
  event: CalendarEvent;
  tags?: TagDto[];
  onAsk?: () => void;
  isAsking?: boolean;
}

const FREQ_LABELS: Record<string, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

function rruleToCadence(rrule: string): string {
  const match = rrule.match(/FREQ=(\w+)/);
  return (match && FREQ_LABELS[match[1]]) ?? "Recurring";
}

export function UpcomingEventCard({ event, tags, onAsk, isAsking }: Props) {
  const color = event.color ?? "var(--mantine-color-gray-4)";
  const hasMeta = !!(event.location || event.link || event.rrule);

  return (
    <Paper
      withBorder
      radius="md"
      p="sm"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <Stack gap={4}>
        <Text fw={600} size="sm" lineClamp={2}>
          {event.title}
        </Text>
        <Group gap={6} align="center">
          <IconClock size={12} color="var(--mantine-color-dimmed)" />
          <Text size="xs" c="dimmed">
            {formatEventTime(event.start, event.end)}
          </Text>
        </Group>
        {event.description && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {event.description}
          </Text>
        )}
        {hasMeta && (
          <Group gap="xs" wrap="wrap" mt={2}>
            {event.location && (
              <Badge
                size="xs"
                variant="light"
                leftSection={<IconMapPin size={10} />}
              >
                {event.location}
              </Badge>
            )}
            {event.link && (
              <Badge
                size="xs"
                variant="light"
                component="a"
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ cursor: "pointer" }}
                leftSection={<IconLink size={10} />}
              >
                Link
              </Badge>
            )}
            {event.rrule && (
              <Badge
                size="xs"
                variant="light"
                leftSection={<IconRepeat size={10} />}
              >
                {rruleToCadence(event.rrule)}
              </Badge>
            )}
          </Group>
        )}
        {onAsk && (
          <Group justify="space-between" gap="xs" mt={4} wrap="nowrap">
            <Group
              gap={4}
              wrap="nowrap"
              style={{ minWidth: 0, overflow: "hidden", flex: 1 }}
            >
              {tags?.slice(0, TAG_LIMIT).map((tag) => (
                <Badge
                  key={tag.id}
                  size="xs"
                  variant="dot"
                  color={tag.color}
                  styles={{
                    label: { overflow: "hidden", textOverflow: "ellipsis" },
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
              {(tags?.length ?? 0) > TAG_LIMIT && (
                <Badge
                  size="xs"
                  variant="light"
                  color="gray"
                  style={{ flexShrink: 0 }}
                >
                  +{(tags?.length ?? 0) - TAG_LIMIT} more
                </Badge>
              )}
            </Group>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconMessage size={14} />}
              onClick={onAsk}
              loading={isAsking}
              style={{ flexShrink: 0 }}
            >
              Start a thread
            </Button>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
