export type ResponseTimeUnit = "minutes" | "hours";

const MINUTE_IN_MS = 60_000;
const HOUR_IN_MS = 3_600_000;

export function responseTimeToUnit(ms: number): {
  value: number;
  unit: ResponseTimeUnit;
} {
  if (ms >= HOUR_IN_MS && ms % HOUR_IN_MS === 0) {
    return { value: ms / HOUR_IN_MS, unit: "hours" };
  }

  return { value: Math.max(1, Math.round(ms / MINUTE_IN_MS)), unit: "minutes" };
}

export function responseTimeToMillis(
  value: number,
  unit: ResponseTimeUnit,
): number {
  const safeValue = Number.isFinite(value) ? value : 0;

  if (unit === "hours") return Math.max(0, safeValue) * HOUR_IN_MS;

  return Math.max(0, safeValue) * MINUTE_IN_MS;
}

export function formatResponseTime(ms: number): string {
  const { value, unit } = responseTimeToUnit(ms);
  const label = unit === "hours" ? "hr" : "min";

  return `${value} ${label}`;
}
