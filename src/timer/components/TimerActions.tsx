import { Group } from "@mantine/core";
import { TimerMoreMenu } from "./TimerMoreMenu";
import { TimerPrimaryAction } from "./TimerPrimaryAction";
import { TimerSkipAction } from "./TimerSkipAction";
import { TimerStartOptions } from "./TimerStartOptions";

export type TimerActionSize = "sm" | "md" | "lg";

interface TimerActionsProps {
  /** Icon-first layout for tight surfaces (floating widget, dashboard). */
  compact?: boolean;
  size?: TimerActionSize;
}

/** Primary action + skip + ⋯ menu; full layout also lists other start modes. */
export function TimerActions({ compact = false, size = "lg" }: TimerActionsProps) {
  return (
    <Group gap="sm" justify="center" wrap={compact ? "nowrap" : "wrap"}>
      <TimerPrimaryAction compact={compact} size={size} />
      <TimerSkipAction compact={compact} size={size} />
      {!compact && <TimerStartOptions />}
      <TimerMoreMenu compact={compact} size={size} />
    </Group>
  );
}
