import { createFileRoute } from "@tanstack/react-router";

import { PublicViewPage } from "@/public-schedule/components/PublicViewPage";

export const Route = createFileRoute("/public/$slug")({
  component: PublicViewRoute,
});

function PublicViewRoute() {
  const { slug } = Route.useParams();
  return <PublicViewPage slug={slug} />;
}
