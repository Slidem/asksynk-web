import { ActionIcon, Button, Group, Tooltip } from "@mantine/core";
import {
  IconBrain,
  IconCoffee,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerStop,
} from "@tabler/icons-react";
import { useTimerController } from "@/timer/hooks/useTimerController";

interface TimerControlsProps {
  size?: "sm" | "md" | "lg" | "xl";
  iconSize?: number;
  /** Icon-only switch button (for tight surfaces like the floating widget). */
  compact?: boolean;
}

export function TimerControls({
  size = "lg",
  iconSize = 22,
  compact = false,
}: TimerControlsProps) {
  const {
    canPause,
    canResume,
    canStop,
    canSwitch,
    alternate,
    pause,
    resume,
    stop,
    switchToAlternate,
    isPending,
  } = useTimerController();

  const switchIcon =
    alternate?.sessionType === "focus" ? (
      <IconBrain size={iconSize} />
    ) : (
      <IconCoffee size={iconSize} />
    );

  return (
    <Group gap="sm" justify="center">
      {canSwitch &&
        alternate &&
        (compact ? (
          <Tooltip label={alternate.label}>
            <ActionIcon
              size={size}
              radius="xl"
              variant="light"
              onClick={switchToAlternate}
              loading={isPending}
              aria-label={alternate.label}
              data-no-drag
            >
              {switchIcon}
            </ActionIcon>
          </Tooltip>
        ) : (
          <Button
            size={size}
            radius="xl"
            variant="light"
            leftSection={switchIcon}
            onClick={switchToAlternate}
            loading={isPending}
            data-no-drag
          >
            {alternate.label}
          </Button>
        ))}
      {canResume && (
        <ActionIcon
          size={size}
          radius="xl"
          variant="filled"
          onClick={resume}
          loading={isPending}
          aria-label="Resume"
          data-no-drag
        >
          <IconPlayerPlay size={iconSize} />
        </ActionIcon>
      )}
      {canPause && (
        <ActionIcon
          size={size}
          radius="xl"
          variant="filled"
          onClick={pause}
          loading={isPending}
          aria-label="Pause"
          data-no-drag
        >
          <IconPlayerPause size={iconSize} />
        </ActionIcon>
      )}
      {canStop && (
        <ActionIcon
          size={size}
          radius="xl"
          variant="light"
          color="gray"
          onClick={stop}
          loading={isPending}
          aria-label="Stop"
          data-no-drag
        >
          <IconPlayerStop size={iconSize} />
        </ActionIcon>
      )}
    </Group>
  );
}
