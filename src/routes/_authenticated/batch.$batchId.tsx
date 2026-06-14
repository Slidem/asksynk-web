import { createFileRoute } from "@tanstack/react-router";

import { BatchDetailPage } from "@/tasks/components/BatchDetailPage";

export const Route = createFileRoute("/_authenticated/batch/$batchId")({
  component: BatchDetailRoute,
});

function BatchDetailRoute() {
  const { batchId } = Route.useParams();
  return <BatchDetailPage batchId={batchId} />;
}
