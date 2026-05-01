import { Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";

import type { GuestDto } from "@/public-views/models/guest";
import { UserBadge } from "@/components/UserBadge";

interface Props {
  guest: GuestDto;
}

export function GuestRow({ guest }: Props) {
  return (
    <Group justify="space-between" wrap="nowrap" px="md" py="sm">
      <UserBadge name={guest.displayName} variant="name" color="grape" />
      <Stack gap={2} align="flex-end">
        <Text size="xs" c="dimmed">
          Joined {dayjs(guest.createdAt).format("MMM D, YYYY HH:mm")}
        </Text>
        <Text size="xs" c="dimmed">
          Last seen {dayjs(guest.lastSeenAt).format("MMM D, HH:mm")}
        </Text>
      </Stack>
    </Group>
  );
}
