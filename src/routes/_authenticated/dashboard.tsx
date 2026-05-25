import { createFileRoute } from "@tanstack/react-router";

import { AttentionItemsDashboard } from "@/attentionItems/components/AttentionItemsDashboard";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return <AttentionItemsDashboard />;
}
