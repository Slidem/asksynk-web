import { createFileRoute } from "@tanstack/react-router";

import { NetworkPage } from "@/network/components/NetworkPage";

export const Route = createFileRoute("/_authenticated/network")({
  component: NetworkPage,
});
