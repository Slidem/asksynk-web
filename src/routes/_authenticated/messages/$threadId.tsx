import { createFileRoute } from "@tanstack/react-router";
import { ThreadView } from "@/messages/components/ThreadView";

export const Route = createFileRoute("/_authenticated/messages/$threadId")({
  component: ThreadRoute,
});

function ThreadRoute() {
  const { threadId } = Route.useParams();
  return <ThreadView threadId={threadId} />;
}
