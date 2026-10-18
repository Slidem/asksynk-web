import { ActionIcon, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconDots,
  IconPlayerPlay,
  IconPlayerSkipForward,
  IconPlayerStop,
  IconRefresh,
} from "@tabler/icons-react";
import { useTimerController } from "@/timer/hooks/useTimerController";
import { modeLabel } from "@/timer/models/timer";
import type { TimerActionSize } from "./TimerActions";

interface TimerMoreMenuProps {
  compact: boolean;
  size: TimerActionSize;
}

export function TimerMoreMenu({ compact, size }: TimerMoreMenuProps) {
  const {
    status,
    isActive,
    session,
    otherSkipModes,
    otherNextModes,
    can,
    durationOf,
    start,
    stop,
    reset,
  } = useTimerController();

  // Compact surfaces have no room for TimerStartOptions — list them here.
  const startModes = compact ? otherNextModes : [];
  // `stop` from completed only clears the finished block — not offered.
  const canStop = can("stop") && status !== "completed";
  const canReset = can("reset");

  if (
    otherSkipModes.length === 0 &&
    startModes.length === 0 &&
    !canStop &&
    !canReset
  ) {
    return null;
  }

  const confirmReset = () => {
    const blocks = session?.completedFocusBlocks ?? 0;
    modals.openConfirmModal({
      title: "End session?",
      centered: true,
      children: (
        <Text size="sm">
          Resets this session's counters ({blocks} focus{" "}
          {blocks === 1 ? "block" : "blocks"}).
          {isActive ? " The current block is discarded." : ""}
        </Text>
      ),
      labels: { confirm: "End session", cancel: "Keep going" },
      confirmProps: { color: "red" },
      onConfirm: reset,
    });
  };

  return (
    <Menu position="bottom-end" withArrow shadow="md" width={240}>
      <Menu.Target>
        <ActionIcon
          size={compact ? size : "lg"}
          radius="xl"
          variant="subtle"
          color="gray"
          aria-label="More timer actions"
          data-no-drag
        >
          <IconDots size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown data-no-drag>
        {otherSkipModes.map((mode) => (
          <Menu.Item
            key={mode}
            leftSection={<IconPlayerSkipForward size={16} />}
            onClick={() => start(mode)}
          >
            Skip to {modeLabel(mode).toLowerCase()}
          </Menu.Item>
        ))}
        {startModes.map((mode) => {
          const seconds = durationOf(mode);
          return (
            <Menu.Item
              key={mode}
              leftSection={<IconPlayerPlay size={16} />}
              onClick={() => start(mode)}
            >
              Start {modeLabel(mode).toLowerCase()}
              {seconds != null ? ` · ${Math.round(seconds / 60)}m` : ""}
            </Menu.Item>
          );
        })}
        {canStop && (
          <Menu.Item leftSection={<IconPlayerStop size={16} />} onClick={stop}>
            <Text size="sm">Stop block</Text>
            <Text size="xs" c="dimmed">
              Discard — not counted. Session continues.
            </Text>
          </Menu.Item>
        )}
        {canReset && (
          <>
            {(otherSkipModes.length > 0 || startModes.length > 0 || canStop) && (
              <Menu.Divider />
            )}
            <Menu.Item
              color="red"
              leftSection={<IconRefresh size={16} />}
              onClick={confirmReset}
            >
              <Text size="sm">End session</Text>
              <Text size="xs" c="dimmed">
                Reset counters. Next start begins a new session.
              </Text>
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
