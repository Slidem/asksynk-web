import {
  Button,
  Group,
  Loader,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";

import { useUpcomingTagCalendarEvents } from "@/schedule/hooks/queries/useUpcomingTagCalendarEvents";

interface Props {
  tagId: string;
}

function formatEventTime(start: Date, end: Date) {
  const day = start.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = `${start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}–${end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  return `${day} · ${time}`;
}

export function TagUpcomingEventsPopover({ tagId }: Props) {
  const { data, isLoading } = useUpcomingTagCalendarEvents(tagId);
  const count = data?.length ?? 0;

  return (
    <Popover position="bottom-start" width={320} withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="default"
          size="xs"
          leftSection={<IconCalendarEvent size={14} />}
        >
          Upcoming events ({count})
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        {isLoading ? (
          <Group justify="center" py="sm">
            <Loader size="xs" />
          </Group>
        ) : count === 0 ? (
          <Text size="sm" c="dimmed">
            No events in the next 7 days
          </Text>
        ) : (
          <Stack gap="xs">
            {data!.map((e) => (
              <Stack key={e.id} gap={2}>
                <Text size="sm" fw={500} lineClamp={1}>
                  {e.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {formatEventTime(e.start, e.end)}
                </Text>
              </Stack>
            ))}
          </Stack>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}
