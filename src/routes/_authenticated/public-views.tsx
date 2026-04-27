import { createFileRoute } from "@tanstack/react-router";

import { PublicViewsPage } from "@/public-views/components/PublicViewsPage";

export const Route = createFileRoute("/_authenticated/public-views")({
  component: PublicViewsPage,
});
