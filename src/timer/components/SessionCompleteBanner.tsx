import { Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { useTimer } from "@/timer/hooks/queries/useTimer";
import { sessionTypeLabel } from "@/timer/models/timer";

/** Shown after a session completes: type + duration with a green check. */
export function SessionCompleteBanner() {
  const { data: timer } = useTimer();
  if (!timer || timer.status !== "completed") return null;

  const minutes = Math.round(timer.sessionDurationSeconds / 60);
  const subtitle =
    timer.sessionType === "focus"
      ? `${minutes} min focused`
      : `${minutes} min break`;

  return (
    <Group gap="sm" align="center">
      <ThemeIcon color="green" variant="light" radius="xl" size="lg">
        <IconCircleCheck size={22} />
      </ThemeIcon>
      <Stack gap={0}>
        <Text fw={600} size="sm">
          {sessionTypeLabel(timer.sessionType)} complete
        </Text>
        <Text size="xs" c="dimmed">
          {subtitle}
        </Text>
      </Stack>
    </Group>
  );
}
