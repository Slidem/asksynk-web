const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

export function formatBlockRange(start: Date, end: Date): string {
  return `${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
}

// Fraction elapsed through [start, end], clamped 0..1.
export function blockProgress(start: Date, end: Date, now: Date): number {
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 1;
  const elapsed = (now.getTime() - start.getTime()) / total;
  return Math.min(1, Math.max(0, elapsed));
}

export function formatTimeLeft(end: Date, now: Date): string {
  const mins = Math.ceil((end.getTime() - now.getTime()) / 60_000);
  if (mins <= 0) return "ending";
  if (mins < 60) return `${mins}m left`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h left` : `${h}h ${m}m left`;
}
