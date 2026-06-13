export function validateTaskTitle(value: string): string | null {
  if (!value.trim()) {
    return "Title is required";
  }
  return null;
}
