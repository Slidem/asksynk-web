import { Box, Button, ColorSwatch, Group, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

import { useCalendarProviderCalendars } from "@/integrations/hooks/queries/useCalendarProviderCalendars";
import { useIsViewingOwnCalendar } from "@/schedule/hooks/useIsViewingOwnCalendar";

export function CalendarIntegrationsLegend() {
  const navigate = useNavigate();
  const isOwn = useIsViewingOwnCalendar();
  const { data: providerCalendars } = useCalendarProviderCalendars();

  const calendars = useMemo(
    () => Array.from(providerCalendars?.values() ?? []),
    [providerCalendars],
  );

  if (!isOwn) return null;

  return (
    <Box
      style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}
    >
      <Group justify="space-between" px="sm" py="xs" wrap="wrap" gap="xs">
        <Group gap="md" wrap="wrap">
          {calendars.length === 0 ? (
            <Text size="xs" c="dimmed">
              No calendar integrations yet
            </Text>
          ) : (
            calendars.map((c) => (
              <Group key={c.id} gap={6} wrap="nowrap">
                <ColorSwatch
                  size={10}
                  color={c.color ?? "var(--mantine-color-gray-5)"}
                />
                <Text size="xs" lineClamp={1}>
                  {c.name ?? "Calendar"}
                </Text>
              </Group>
            ))
          )}
        </Group>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconPlus size={14} />}
          onClick={() =>
            navigate({ to: "/integrations", search: { connected: undefined } })
          }
        >
          Add calendar integration
        </Button>
      </Group>
    </Box>
  );
}
