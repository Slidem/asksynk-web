import { Alert, Group, Loader, Modal, Stack, Tabs, Text } from "@mantine/core";
import {
  IconCalendar,
  IconCalendarEvent,
  IconInfoCircle,
  IconTag,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";

import { UserBadge } from "@/components/UserBadge";
import {
  useUserAvailabilityDialog,
  useUserAvailabilityDialogHandlers,
} from "@/network/hooks/dialogs/userAvailabilityDialogHooks";
import { UserAvailabilityCalendar } from "@/network/components/UserAvailabilityCalendar";
import { UserTagAvailabilityCard } from "@/network/components/UserTagAvailabilityCard";
import { useStartTaggedThread } from "@/messages/hooks/useStartTaggedThread";
import { UpcomingEventCard } from "@/schedule/components/UpcomingEventCard";
import type { CalendarEvent } from "@/schedule/models/calendarEvent";
import { useUpcomingUserCalendarEvents } from "@/schedule/hooks/queries/useUpcomingUserCalendarEvents";
import { useUserTagsService } from "@/tags/hooks/useUserTagsService";

export function UserAvailabilityDialog() {
  const { opened, user } = useUserAvailabilityDialog();
  const { close } = useUserAvailabilityDialogHandlers();
  const [activeTab, setActiveTab] = useState<string | null>("tags");

  const handleClose = useCallback(() => {
    setActiveTab("tags");
    close();
  }, [close]);

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "";

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        user ? (
          <UserBadge
            variant="full"
            name={displayName}
            email={user.email}
            image={user.image}
          />
        ) : null
      }
      size="xl"
    >
      {user && (
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="tags" leftSection={<IconTag size={14} />}>
              By tag
            </Tabs.Tab>
            <Tabs.Tab
              value="timeblocks"
              leftSection={<IconCalendarEvent size={14} />}
            >
              Timeblocks (next 7 days)
            </Tabs.Tab>
            <Tabs.Tab value="calendar" leftSection={<IconCalendar size={14} />}>
              Calendar
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="tags" pt="md">
            <TagsAvailabilityPanel userId={user.userId} />
          </Tabs.Panel>

          <Tabs.Panel value="timeblocks" pt="md">
            <TimeblocksPanel userId={user.userId} />
          </Tabs.Panel>

          <Tabs.Panel value="calendar" pt="md">
            {activeTab === "calendar" && (
              <UserAvailabilityCalendar userId={user.userId} />
            )}
          </Tabs.Panel>
        </Tabs>
      )}
    </Modal>
  );
}

function TagsAvailabilityPanel({ userId }: { userId: string }) {
  const { tags } = useUserTagsService(userId);

  return (
    <Stack gap="sm">
      <Alert variant="light" color="blue" icon={<IconInfoCircle size={16} />}>
        <Text size="sm">
          These are this user's tags with their fastest expected answer time
          when addressing a question based on each tag.
        </Text>
      </Alert>
      {tags.length === 0 ? (
        <EmptyState message="No tags" />
      ) : (
        <Stack gap="xs">
          {tags.map((tag) => (
            <UserTagAvailabilityCard key={tag.id} tag={tag} userId={userId} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function TimeblocksPanel({ userId }: { userId: string }) {
  const { data, isLoading } = useUpcomingUserCalendarEvents(userId);
  const { close } = useUserAvailabilityDialogHandlers();
  const { start, isStarting } = useStartTaggedThread();

  const handleAsk = async (event: CalendarEvent) => {
    await start(userId, event.tagIds ?? []);
    close();
  };

  if (isLoading) {
    return (
      <Group justify="center" py="sm">
        <Loader size="sm" />
      </Group>
    );
  }
  if (!data || data.length === 0) {
    return <EmptyState message="No events in the next 7 days" />;
  }
  return (
    <Stack gap="xs">
      {data.map((event) => (
        <UpcomingEventCard
          key={event.id}
          event={event}
          onAsk={() => handleAsk(event)}
          isAsking={isStarting}
        />
      ))}
    </Stack>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Group gap="xs" align="center" c="dimmed" py="md">
      <IconInfoCircle size={16} />
      <Text size="sm">{message}</Text>
    </Group>
  );
}
