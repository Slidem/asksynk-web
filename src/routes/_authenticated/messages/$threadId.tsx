import { createFileRoute } from "@tanstack/react-router";
import { ThreadView } from "@/messages/components/ThreadView";

interface ThreadSearch {
  initialTagIds?: string[];
}

export const Route = createFileRoute("/_authenticated/messages/$threadId")({
  validateSearch: (search: Record<string, unknown>): ThreadSearch => {
    const raw = search.initialTagIds;
    const ids = Array.isArray(raw)
      ? raw.filter((v): v is string => typeof v === "string")
      : typeof raw === "string"
        ? [raw]
        : [];
    return ids.length > 0 ? { initialTagIds: ids } : {};
  },
  component: ThreadRoute,
});

function ThreadRoute() {
  const { threadId } = Route.useParams();
  const { initialTagIds } = Route.useSearch();
  return <ThreadView threadId={threadId} initialTagIds={initialTagIds} />;
}
