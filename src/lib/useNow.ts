import { useEffect, useState } from "react";

/**
 * Returns the current time, refreshed every `intervalMs`. Use a coarse interval
 * (30–60s) for time-derived UI (countdowns, "current timeblock", urgency
 * buckets) so it stays correct without per-second re-renders.
 */
export function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
