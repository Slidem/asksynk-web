import { useTimer } from "@/timer/hooks/queries/useTimer";
import { useEffect, useState } from "react";

const IDLE_AFTER_MS = 5 * 60 * 1000;

/**
 * Idle = not running/paused and the last transition was > 5 min ago — the timer
 * is stale. A one-shot timeout flips it at the threshold (the engine stops
 * ticking when not running, so nothing else would re-render it).
 */
export function useTimerIdle(): boolean {
  const { data: timer } = useTimer();
  // transitionedAt we've marked idle for; render compares it to the current one
  // so a stale `true` can't leak after a transition.
  const [idleAt, setIdleAt] = useState<string | null>(null);

  const status = timer?.status ?? "idle";
  const isActive = status === "running" || status === "paused";
  const transitionedAt = timer?.transitionedAt;

  useEffect(() => {
    if (isActive || !transitionedAt) {
      return;
    }
    const remaining =
      IDLE_AFTER_MS - (Date.now() - new Date(transitionedAt).getTime());

    const id = setTimeout(
      () => setIdleAt(transitionedAt),
      Math.max(remaining, 0),
    );

    return () => clearTimeout(id);
  }, [isActive, transitionedAt]);

  return !isActive && !!transitionedAt && idleAt === transitionedAt;
}
