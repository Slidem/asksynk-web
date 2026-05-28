import { createFileRoute } from "@tanstack/react-router";
import { ThreadView } from "@/messages/components/ThreadView";

interface ThreadSearch {
  initialTagIds?: string[];
  focusMessageId?: string;
}

export const Route = createFileRoute("/_authenticated/messages/$threadId")({
  validateSearch: (search: Record<string, unknown>): ThreadSearch => {
    const raw = search.initialTagIds;
    const ids = Array.isArray(raw)
      ? raw.filter((v): v is string => typeof v === "string")
      : typeof raw === "string"
        ? [raw]
        : [];
    const focus =
      typeof search.focusMessageId === "string"
        ? search.focusMessageId
        : undefined;
    const result: ThreadSearch = {};
    if (ids.length > 0) result.initialTagIds = ids;
    if (focus) result.focusMessageId = focus;
    return result;
  },
  component: ThreadRoute,
});

function ThreadRoute() {
  const { threadId } = Route.useParams();
  const { initialTagIds, focusMessageId } = Route.useSearch();
  return (
    <ThreadView
      threadId={threadId}
      initialTagIds={initialTagIds}
      focusMessageId={focusMessageId}
    />
  );
}
