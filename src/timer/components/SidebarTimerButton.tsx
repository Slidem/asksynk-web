import { useEffect } from "react";
import { Center, RingProgress, Tooltip, UnstyledButton } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { useShallow } from "zustand/shallow";
import { useTimerView } from "@/timer/hooks/useTimerView";
import { useFloatingTimerHiddenStore } from "@/timer/store/floatingTimerHiddenStore";
import classes from "./SidebarTimer.module.css";

/** Hint auto-dismisses a few seconds after minimizing. */
const HINT_MS = 4500;

export function SidebarTimerButton() {
  const view = useTimerView();
  const { showHint, show, dismissHint } = useFloatingTimerHiddenStore(
    useShallow((s) => ({
      showHint: s.showHint,
      show: s.show,
      dismissHint: s.dismissHint,
    })),
  );

  useEffect(() => {
    if (!showHint) return;
    const id = setTimeout(dismissHint, HINT_MS);
    return () => clearTimeout(id);
  }, [showHint, dismissHint]);

  const color = view.color ?? "var(--mantine-color-gray-5)";

  return (
    <Tooltip
      label={
        showHint
          ? "Timer minimized — pop it back anytime from here"
          : "Show timer"
      }
      opened={showHint || undefined}
      position="right"
      multiline={showHint || undefined}
      w={showHint ? 200 : undefined}
      withArrow
    >
      <UnstyledButton
        className={classes.button}
        onClick={show}
        aria-label="Show timer"
      >
        <RingProgress
          size={44}
          thickness={4}
          roundCaps
          sections={[{ value: view.fraction * 100, color }]}
          label={
            <Center>
              <IconClock size={18} stroke={1.5} />
            </Center>
          }
        />
      </UnstyledButton>
    </Tooltip>
  );
}
