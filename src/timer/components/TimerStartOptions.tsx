import { Button } from "@mantine/core";
import { useTimerController } from "@/timer/hooks/useTimerController";
import { modeLabel } from "@/timer/models/timer";

/** Non-suggested start modes while no block is active. */
export function TimerStartOptions() {
  const { otherNextModes, durationOf, start } = useTimerController();

  return otherNextModes.map((mode) => {
    const seconds = durationOf(mode);
    const label =
      seconds != null
        ? `${modeLabel(mode)} · ${Math.round(seconds / 60)}m`
        : modeLabel(mode);

    return (
      <Button
        key={mode}
        size="sm"
        radius="xl"
        variant="subtle"
        onClick={() => start(mode)}
      >
        {label}
      </Button>
    );
  });
}
