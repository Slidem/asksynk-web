export type PomodoroPhase =
  | "idle"
  | "active"
  | "ending-soon"
  | "paused"
  | "completed";

export function phaseToColor(phase: PomodoroPhase): string {
  switch (phase) {
    case "active":
      return "var(--mantine-primary-color-filled)";
    case "ending-soon":
      return "var(--mantine-color-orange-6)";
    case "paused":
      return "var(--mantine-color-gray-5)";
    case "completed":
      return "var(--mantine-color-green-6)";
    case "idle":
      return "var(--mantine-color-gray-4)";
  }
}
