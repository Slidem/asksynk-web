/** Converts null to undefined. */
export function fromNullable<T>(value: T | null): T | undefined {
  return value ?? undefined;
}

/** Trims a string; returns undefined if the result is empty. */
export function cleanString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

/** Applies transform only if value is not undefined. */
export function mapDefined<T, R>(
  value: T | undefined,
  transform: (v: T) => R,
): R | undefined {
  return value !== undefined ? transform(value) : undefined;
}

/** Returns undefined for empty or undefined arrays. */
export function nonEmptyArray<T>(arr: T[] | undefined): T[] | undefined {
  return arr && arr.length > 0 ? arr : undefined;
}

/** Returns value if defined, otherwise the fallback. Distinguishes null from undefined (unlike `??`). */
export function ifPresent<T>(value: T | undefined) {
  return {
    or: <D>(fallback: D): T | D => (value !== undefined ? value : fallback),
  };
}
