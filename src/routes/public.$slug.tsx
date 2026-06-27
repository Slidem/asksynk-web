import { createFileRoute } from "@tanstack/react-router";

import { PublicViewPage } from "@/public-schedule/components/PublicViewPage";
import {
  DEFAULT_PUBLIC_VIEW_TAB,
  isPublicViewTab,
  type PublicViewTab,
} from "@/public-schedule/models/publicViewTab";

interface PublicViewSearch {
  tab?: PublicViewTab;
}

export const Route = createFileRoute("/public/$slug")({
  validateSearch: (search: Record<string, unknown>): PublicViewSearch => {
    // Default tab (calendar) stays out of the URL for clean links.
    const tab = isPublicViewTab(search.tab) ? search.tab : undefined;
    return tab && tab !== "calendar" ? { tab } : {};
  },
  component: PublicViewRoute,
});

function PublicViewRoute() {
  const { slug } = Route.useParams();
  const { tab } = Route.useSearch();
  return <PublicViewPage slug={slug} tab={tab ?? DEFAULT_PUBLIC_VIEW_TAB} />;
}
