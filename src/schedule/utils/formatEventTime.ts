export function formatEventTime(start: Date, end: Date): string {
  const day = start.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = `${start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}–${end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  return `${day} · ${time}`;
}
