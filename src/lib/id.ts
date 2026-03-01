export function createTempId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `temp-${crypto.randomUUID()}`;
  }

  return `temp-${Math.random().toString(36).slice(2)}`;
}
