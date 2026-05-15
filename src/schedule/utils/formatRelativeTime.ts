const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const dayTimeFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
});

export function formatRelativeTime(target: Date, now: Date = new Date()): string {
  const diff = target.getTime() - now.getTime();
  if (diff < 0) return "now";
  if (diff < HOUR_MS) {
    const mins = Math.max(1, Math.round(diff / MINUTE_MS));
    return `in ${mins}m`;
  }
  if (diff < DAY_MS) {
    const hours = Math.round(diff / HOUR_MS);
    return `in ${hours}h`;
  }
  return dayTimeFormatter.format(target);
}
