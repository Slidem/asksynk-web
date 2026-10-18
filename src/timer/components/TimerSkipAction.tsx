import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { IconPlayerSkipForward } from "@tabler/icons-react";
import { useTimerController } from "@/timer/hooks/useTimerController";
import { modeLabel } from "@/timer/models/timer";
import type { TimerActionSize } from "./TimerActions";

const ICON_SIZES: Record<TimerActionSize, number> = { sm: 16, md: 18, lg: 22 };

interface TimerSkipActionProps {
  compact: boolean;
  size: TimerActionSize;
}

/** Skip the active block to the suggested opposite mode (focus ↔ break). */
export function TimerSkipAction({ compact, size }: TimerSkipActionProps) {
  const { skipTarget, start } = useTimerController();
  if (!skipTarget) return null;

  const label = `Skip to ${modeLabel(skipTarget).toLowerCase()}`;
  const hint =
    skipTarget === "focus"
      ? "Ends this break now"
      : "Counts this focus block as done";
  const iconSize = ICON_SIZES[size];

  return (
    <Tooltip label={compact ? `${label} · ${hint}` : hint} withArrow>
      {compact ? (
        <ActionIcon
          size={size}
          radius="xl"
          variant="light"
          onClick={() => start(skipTarget)}
          aria-label={label}
          data-no-drag
        >
          <IconPlayerSkipForward size={iconSize} />
        </ActionIcon>
      ) : (
        <Button
          size={size}
          radius="xl"
          variant="light"
          leftSection={<IconPlayerSkipForward size={iconSize} />}
          onClick={() => start(skipTarget)}
        >
          {label}
        </Button>
      )}
    </Tooltip>
  );
}
