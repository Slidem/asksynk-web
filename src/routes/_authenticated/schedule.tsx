import { createFileRoute } from "@tanstack/react-router";

import { SchedulePage } from "@/schedule/components/SchedulePage";

export const Route = createFileRoute("/_authenticated/schedule")({
  component: SchedulePage,
});
