import {
  Alert,
  Anchor,
  Badge,
  Button,
  ColorSwatch,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconAlignLeft,
  IconClock,
  IconInfoCircle,
  IconLink,
  IconMapPin,
  IconMessage,
  IconRepeat,
  IconTag,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import {
  useCalendarEventReadonlyDialog,
  useCalendarEventReadonlyDialogHandlers,
} from "@/network/hooks/dialogs/calendarEventReadonlyDialogHooks";
import { useUserAvailabilityDialogHandlers } from "@/network/hooks/dialogs/userAvailabilityDialogHooks";
import { useStartTaggedThread } from "@/messages/hooks/useStartTaggedThread";
import { formatEventTime } from "@/schedule/utils/formatEventTime";
import { useUserTagsService } from "@/tags/hooks/useUserTagsService";

interface Props {
  userId: string;
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

function InfoRow({
  icon,
  children,
  align = "center",
}: {
  icon: ReactNode;
  children: ReactNode;
  align?: "center" | "flex-start";
}) {
  return (
    <Group gap={8} align={align} wrap="nowrap">
      <div
        style={{
          color: "var(--mantine-color-dimmed)",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          marginTop: align === "flex-start" ? 2 : 0,
        }}
      >
        {icon}
      </div>
      {typeof children === "string" ? (
        <Text size="sm" c="dimmed" style={{ minWidth: 0, wordBreak: "break-word" }}>
          {children}
        </Text>
      ) : (
        <div style={{ minWidth: 0, flex: 1 }}>{children}</div>
      )}
    </Group>
  );
}

export function CalendarEventReadonlyDialog({ userId }: Props) {
  const { opened, event } = useCalendarEventReadonlyDialog();
  const { close } = useCalendarEventReadonlyDialogHandlers();
  const { close: closeParent } = useUserAvailabilityDialogHandlers();
  const { tags } = useUserTagsService(userId);
  const { start, isStarting } = useStartTaggedThread();

  const eventTags = event?.tagIds?.length
    ? event.tagIds
        .map((id) => tags.find((t) => t.id === id))
        .filter((t) => t !== undefined)
    : [];
  const hasTags = eventTags.length > 0;

  const handleStartThread = async () => {
    if (!event || !hasTags) return;
    await start(userId, event.tagIds ?? []);
    close();
    closeParent();
  };

  return (
    <Modal opened={opened} onClose={close} title="Event details" size="md">
      {event && (
        <Stack gap="md">
          <Group gap={6} align="center" wrap="nowrap">
            {event.color && <ColorSwatch size={12} color={event.color} />}
            <Text fw={700} size="lg">
              {event.title || "Untitled"}
            </Text>
          </Group>

          <Stack gap={10}>
            <InfoRow icon={<IconClock size={14} />}>
              {formatEventTime(event.start, event.end)}
            </InfoRow>
            {event.description && (
              <InfoRow icon={<IconAlignLeft size={14} />} align="flex-start">
                {event.description}
              </InfoRow>
            )}
            {event.location && (
              <InfoRow icon={<IconMapPin size={14} />}>
                {event.location}
              </InfoRow>
            )}
            {event.link && (
              <InfoRow icon={<IconLink size={14} />}>
                <Anchor
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  truncate
                >
                  {event.link}
                </Anchor>
              </InfoRow>
            )}
            {event.rrule && (
              <InfoRow icon={<IconRepeat size={14} />}>
                {rruleToCadence(event.rrule)}
              </InfoRow>
            )}
            {hasTags && (
              <InfoRow icon={<IconTag size={14} />} align="flex-start">
                <Group gap={6} wrap="wrap">
                  {eventTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      size="sm"
                      variant="dot"
                      color={tag.color}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </Group>
              </InfoRow>
            )}
          </Stack>

          {hasTags && (
            <Alert
              variant="light"
              color="blue"
              icon={<IconInfoCircle size={16} />}
              mt={4}
            >
              <Text size="sm">
                Tip: this user has tagged this timeblock — start a thread with
                one of these tags and they'll try to answer during this slot.
              </Text>
            </Alert>
          )}

          <Group justify="flex-end" gap="xs" mt="sm">
            <Button variant="default" onClick={close}>
              Close
            </Button>
            {hasTags && (
              <Button
                leftSection={<IconMessage size={14} />}
                onClick={handleStartThread}
                loading={isStarting}
              >
                Start a thread
              </Button>
            )}
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
