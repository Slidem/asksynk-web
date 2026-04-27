import { Avatar, Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";

import type { GuestDto } from "@/public-views/models/guest";

interface Props {
  guest: GuestDto;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function GuestRow({ guest }: Props) {
  return (
    <Group justify="space-between" wrap="nowrap" px="md" py="sm">
      <Group gap="md" wrap="nowrap">
        <Avatar radius="xl" color="grape">
          {getInitials(guest.displayName)}
        </Avatar>
        <Stack gap={2}>
          <Text fw={500}>{guest.displayName}</Text>
          <Text size="xs" c="dimmed">
            Joined {dayjs(guest.createdAt).format("MMM D, YYYY HH:mm")}
          </Text>
        </Stack>
      </Group>
      <Text size="xs" c="dimmed">
        Last seen {dayjs(guest.lastSeenAt).format("MMM D, HH:mm")}
      </Text>
    </Group>
  );
}
