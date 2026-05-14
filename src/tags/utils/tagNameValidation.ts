export const TAG_NAME_REGEX = /^[a-zA-Z0-9-]+$/;

export function validateTagName(value: string): string | null {
  const t = value.trim();
  if (!t) return "Name required";
  if (!TAG_NAME_REGEX.test(t))
    return "Only letters, numbers, and dashes allowed";
  return null;
}
