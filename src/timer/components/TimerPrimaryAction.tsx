import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { useTimerController } from "@/timer/hooks/useTimerController";
import { modeLabel } from "@/timer/models/timer";
import type { TimerActionSize } from "./TimerActions";

const ICON_SIZES: Record<TimerActionSize, number> = { sm: 16, md: 18, lg: 22 };

interface TimerPrimaryActionProps {
  compact: boolean;
  size: TimerActionSize;
}

/** Pause / Resume while active, otherwise "Start <suggested mode>". */
export function TimerPrimaryAction({ compact, size }: TimerPrimaryActionProps) {
  const { can, nextMode, pause, resume, start } = useTimerController();
  const iconSize = ICON_SIZES[size];

  if (can("pause") || can("resume")) {
    const isPause = can("pause");
    const label = isPause ? "Pause" : "Resume";
    const Icon = isPause ? IconPlayerPause : IconPlayerPlay;
    const onClick = isPause ? pause : resume;

    return compact ? (
      <Tooltip label={label}>
        <ActionIcon
          size={size}
          radius="xl"
          variant="filled"
          onClick={onClick}
          aria-label={label}
          data-no-drag
        >
          <Icon size={iconSize} />
        </ActionIcon>
      </Tooltip>
    ) : (
      <Button
        size={size}
        radius="xl"
        leftSection={<Icon size={iconSize} />}
        onClick={onClick}
      >
        {label}
      </Button>
    );
  }

  if (!nextMode) return null;

  const label = compact
    ? modeLabel(nextMode)
    : `Start ${modeLabel(nextMode).toLowerCase()}`;

  return (
    <Button
      size={compact ? "xs" : size}
      radius="xl"
      leftSection={<IconPlayerPlay size={compact ? 14 : iconSize} />}
      onClick={() => start(nextMode)}
      aria-label={`Start ${modeLabel(nextMode).toLowerCase()}`}
      data-no-drag
    >
      {label}
    </Button>
  );
}
