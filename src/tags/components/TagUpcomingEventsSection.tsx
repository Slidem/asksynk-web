import {
  Collapse,
  Group,
  Loader,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconChevronDown,
} from "@tabler/icons-react";

import { UpcomingEventCard } from "@/schedule/components/UpcomingEventCard";
import { useDisclosure } from "@mantine/hooks";
import { useUpcomingTagCalendarEvents } from "@/schedule/hooks/queries/useUpcomingTagCalendarEvents";

interface Props {
  tagId: string;
}

export function TagUpcomingEventsSection({ tagId }: Props) {
  const { data, isLoading } = useUpcomingTagCalendarEvents(tagId);
  const [opened, { toggle }] = useDisclosure(true);
  const count = data?.length ?? 0;

  return (
    <Stack gap="xs">
      <UnstyledButton onClick={toggle} aria-expanded={opened}>
        <Group justify="space-between" align="center">
          <Group gap="xs" align="center">
            <IconCalendarEvent size={14} />
            <Text fw={500} size="sm">
              Upcoming events ({count})
            </Text>
          </Group>
          <IconChevronDown
            size={14}
            style={{
              transform: opened ? "rotate(180deg)" : "none",
              transition: "transform 150ms",
            }}
          />
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>
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
            {data!.map((event) => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </Stack>
        )}
      </Collapse>
    </Stack>
  );
}
