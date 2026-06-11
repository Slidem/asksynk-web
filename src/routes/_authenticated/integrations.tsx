import { createFileRoute } from "@tanstack/react-router";

import { IntegrationsPage } from "@/integrations/components/IntegrationsPage";

export const Route = createFileRoute("/_authenticated/integrations")({
  validateSearch: (search: Record<string, string | undefined>) => ({
    connected: search.connected,
  }),
  component: IntegrationsPage,
});
