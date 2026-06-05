import { ActionIcon, Group, Paper, Stack, Text } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import { useShallow } from "zustand/shallow";
import { useTimerView } from "@/timer/hooks/useTimerView";
import { useDraggable } from "@/timer/hooks/useDraggable";
import { useFloatingTimerVisible } from "@/timer/hooks/useFloatingTimerVisible";
import { useFloatingTimerHiddenStore } from "@/timer/store/floatingTimerHiddenStore";
import { useFloatingTimerPositionStore } from "@/timer/store/floatingTimerPositionStore";
import { StartNextButton } from "./StartNextButton";
import { TimerControls } from "./TimerControls";
import { TimerDisplay } from "./TimerDisplay";
import { TimerProgressBar } from "./TimerProgressBar";
import classes from "./FloatingTimer.module.css";

export function FloatingTimer() {
  const visible = useFloatingTimerVisible();
  const view = useTimerView();
  const hide = useFloatingTimerHiddenStore((s) => s.hide);
  const { x, y, setPosition } = useFloatingTimerPositionStore(
    useShallow((s) => ({ x: s.x, y: s.y, setPosition: s.setPosition })),
  );
  const { handleProps, isDragging } = useDraggable({ onChange: setPosition });

  if (!visible) return null;

  const positioned = x != null && y != null;
  const positionStyle = positioned
    ? { left: x, top: y, right: "auto", bottom: "auto" }
    : undefined;
  const sessionLabel = view.isActive ? view.label : `Next · ${view.label}`;

  return (
    <Paper
      className={classes.floating}
      style={{ ...positionStyle, cursor: isDragging ? "grabbing" : "grab" }}
      shadow="lg"
      radius="md"
      withBorder
      p="sm"
      {...handleProps}
    >
      <Stack gap={8}>
        <Group justify="space-between" gap="xs" wrap="nowrap">
          <Text
            size="xs"
            c="dimmed"
            fw={600}
            tt="uppercase"
            style={{ letterSpacing: "0.06em" }}
          >
            {sessionLabel}
          </Text>
          <Group gap={4} wrap="nowrap" align="center">
            <TimerDisplay
              seconds={view.displaySeconds}
              fontSize="1.3rem"
              color={view.color}
              pulse={view.pulse}
            />
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={hide}
              data-no-drag
              aria-label="Minimize timer"
            >
              <IconMinus size={14} />
            </ActionIcon>
          </Group>
        </Group>
        <TimerProgressBar
          fraction={view.fraction}
          color={view.color ?? "var(--mantine-color-gray-5)"}
          pulse={view.pulse}
          height={6}
        />
        <Group justify="center">
          {view.isActive ? (
            <TimerControls size="sm" iconSize={16} compact />
          ) : (
            <StartNextButton size="sm" iconSize={16} />
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
