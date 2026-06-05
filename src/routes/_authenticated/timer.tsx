import { PomodoroTimer } from "@/timer/components/PomodoroTimer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/timer")({
  component: TimerPage,
});

function TimerPage() {
  return <PomodoroTimer />;
}
