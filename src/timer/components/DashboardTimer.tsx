import { Box, Card, Group, Stack, Text } from "@mantine/core";
import { useTimerView } from "@/timer/hooks/useTimerView";
import { StartNextControls } from "./StartNextControls";
import { TimerControls } from "./TimerControls";
import { TimerDisplay } from "./TimerDisplay";
import { TimerProgressBar } from "./TimerProgressBar";

export function DashboardTimer() {
  const view = useTimerView();

  if (view.idle) return null;

  const sessionLabel = view.isActive ? view.label : `Next · ${view.label}`;

  return (
    <Card radius="lg" padding="lg">
      <Group wrap="nowrap" gap="lg" align="center">
        <Stack gap={2}>
          <Text
            size="xs"
            c="dimmed"
            fw={600}
            tt="uppercase"
            style={{ letterSpacing: "0.06em" }}
          >
            {sessionLabel}
            {view.status === "paused" ? " · Paused" : ""}
          </Text>
          <TimerDisplay
            seconds={view.displaySeconds}
            fontSize="2rem"
            color={view.color}
            pulse={view.pulse}
          />
        </Stack>
        <Box style={{ flex: 1 }}>
          <TimerProgressBar
            fraction={view.fraction}
            color={view.color ?? "var(--mantine-color-gray-5)"}
            pulse={view.pulse}
            height={8}
          />
        </Box>
        {view.isActive ? (
          <TimerControls size="md" iconSize={18} compact />
        ) : (
          <StartNextControls size="sm" iconSize={16} buttonSize="xs" />
        )}
      </Group>
    </Card>
  );
}
