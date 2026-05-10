import { createFileRoute } from "@tanstack/react-router";
import { NoThreadSelected } from "@/messages/components/NoThreadSelected";

export const Route = createFileRoute("/_authenticated/messages/")({
  component: NoThreadSelected,
});
