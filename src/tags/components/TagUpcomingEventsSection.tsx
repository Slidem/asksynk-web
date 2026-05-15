import { Accordion, Group, Loader, Stack, Text } from "@mantine/core";
import { IconCalendarEvent, IconInfoCircle } from "@tabler/icons-react";

import { UpcomingEventCard } from "@/schedule/components/UpcomingEventCard";
import { useUpcomingTagCalendarEvents } from "@/schedule/hooks/queries/useUpcomingTagCalendarEvents";

interface Props {
  tagId: string;
}

const ACCORDION_VALUE = "upcoming-events";

export function TagUpcomingEventsSection({ tagId }: Props) {
  const { data, isLoading } = useUpcomingTagCalendarEvents(tagId);
  const count = data?.length ?? 0;

  return (
    <Accordion.Item value={ACCORDION_VALUE}>
      <Accordion.Control icon={<IconCalendarEvent size={16} />}>
        <Text fw={500} size="sm">
          Upcoming events ({count})
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        {isLoading ? (
          <Group justify="center" py="sm">
            <Loader size="xs" />
          </Group>
        ) : count === 0 ? (
          <Group gap="xs" align="center" c="dimmed">
            <IconInfoCircle size={16} />
            <Text size="sm">
              No calendar events associated with this tag yet
            </Text>
          </Group>
        ) : (
          <Stack gap="xs">
            {data!.map((event) => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </Stack>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}
