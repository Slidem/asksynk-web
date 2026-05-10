export const toISOStringWithTimezone = (date: Date) => {
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    getTimezoneOffset(date)
  );
};

const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");

// Get timezone offset in ISO format (+hh:mm or -hh:mm)
const getTimezoneOffset = (date: Date) => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  return diff + pad(tzOffset / 60) + ":" + pad(tzOffset % 60);
};

export function formatIsoStringToRelativeDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minute = 60000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m`;
  if (diff < day) return `${Math.floor(diff / hour)}h`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d`;
  return date.toLocaleDateString();
}
export function isoStringToTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function isoStringToFullDate(iso: string) {
  return new Date(iso).toLocaleString();
}
