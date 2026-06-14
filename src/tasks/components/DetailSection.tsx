import { Card, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

// One bordered section card for the detail pages — a single border per section
// (no border-in-border), with an optional header action (e.g. an Edit toggle).
export function DetailSection({ icon, title, action, children }: Props) {
  return (
    <Card withBorder radius="md" padding="md">
      <Stack gap="sm">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs">
            {icon}
            <Text fw={600} size="sm">
              {title}
            </Text>
          </Group>
          {action}
        </Group>
        {children}
      </Stack>
    </Card>
  );
}
