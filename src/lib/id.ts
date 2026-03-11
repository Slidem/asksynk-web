import { UUID, uuidv7obj } from "uuidv7";

export function createTempId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `temp-${crypto.randomUUID()}`;
  }

  return `temp-${Math.random().toString(36).slice(2)}`;
}

export function createUuidV7(): UUID {
  return uuidv7obj();
}
