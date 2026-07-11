import {
  ActionIcon,
  Box,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useAttentionItemsByUrgency } from "@/attentionItems/hooks/useAttentionItemsByUrgency";
import { useTimerView } from "@/timer/hooks/useTimerView";
import { useTimerSettingsDialogHandlers } from "@/timer/hooks/dialogs/timerSettingsDialogHooks";
import { CurrentTimeblockPanel } from "./CurrentTimeblockPanel";
import { FocusNowList } from "./FocusNowList";
import { FocusOverduePanel } from "./FocusOverduePanel";
import { SessionCompleteBanner } from "./SessionCompleteBanner";
import { SessionTypePicker } from "./SessionTypePicker";
import { StartNextControls } from "./StartNextControls";
import { TimerControls } from "./TimerControls";
import { TimerDisplay } from "./TimerDisplay";
import { TimerProgressBar } from "./TimerProgressBar";

export function PomodoroTimer() {
  const view = useTimerView();
  const { open: openSettings } = useTimerSettingsDialogHandlers();
  const { grouped, isLoading } = useAttentionItemsByUrgency();

  const sessionLabel = view.isActive ? view.label : `Next · ${view.label}`;

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Timer</Title>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={openSettings}
            aria-label="Timer settings"
          >
            <IconSettings size={20} />
          </ActionIcon>
        </Group>

        <Card radius="lg" padding="xl">
          <Stack gap="xl" align="center" py="lg">
            {view.status === "completed" && !view.idle && (
              <SessionCompleteBanner />
            )}

            <Text
              tt="uppercase"
              fw={600}
              size="sm"
              c="dimmed"
              style={{ letterSpacing: "0.08em" }}
            >
              {sessionLabel}
              {view.status === "paused" ? " · Paused" : ""}
            </Text>

            <TimerDisplay
              seconds={view.displaySeconds}
              fontSize="clamp(3.5rem, 14vw, 5.5rem)"
              color={view.color}
              pulse={view.pulse}
            />

            <Box w="100%" maw={420}>
              <TimerProgressBar
                fraction={view.fraction}
                color={view.color ?? "var(--mantine-color-gray-5)"}
                pulse={view.pulse}
                height={10}
              />
            </Box>

            {view.isActive ? (
              <TimerControls size="xl" iconSize={26} />
            ) : view.idle ? (
              <SessionTypePicker size="md" />
            ) : (
              <StartNextControls />
            )}
          </Stack>
        </Card>

        <CurrentTimeblockPanel />
        <FocusNowList items={grouped.now} isLoading={isLoading} />
        <FocusOverduePanel items={grouped.overdue} />
      </Stack>
    </Container>
  );
}
