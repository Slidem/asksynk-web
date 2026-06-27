import { Box, Button, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

import { UserBadge } from "@/components/UserBadge";
import {
  useGuestSession,
  useGuestSessionHandlers,
} from "@/public-schedule/hooks/useGuestSession";
import type { PublicViewMetadataDto } from "@/public-schedule/models/publicView";

interface Props {
  view: PublicViewMetadataDto;
  tabs?: ReactNode;
  children: ReactNode;
}

export function PublicViewLayout({ view, tabs, children }: Props) {
  const session = useGuestSession();
  const { clear } = useGuestSessionHandlers();

  return (
    <Stack
      gap={0}
      style={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "var(--mantine-color-body)",
      }}
    >
      <Group
        justify="space-between"
        px="lg"
        py="sm"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <Group gap="sm" wrap="nowrap">
          <UserBadge image={view.ownerImage} variant="avatar" size="md" />
          <Stack gap={0}>
            <Text fw={500}>{view.name ?? "Shared schedule"}</Text>
            <Text size="xs" c="dimmed">
              Read-only view
            </Text>
          </Stack>
        </Group>
        <Group gap="md">
          {session && (
            <Text size="sm" c="dimmed">
              Signed in as <b>{session.displayName}</b>
            </Text>
          )}
          <Button size="xs" variant="default" onClick={clear}>
            Leave
          </Button>
        </Group>
      </Group>

      {tabs}

      <Box
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          padding: "var(--mantine-spacing-md)",
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}
