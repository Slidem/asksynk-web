import { createFileRoute } from "@tanstack/react-router";

import { InviteResponsePage } from "@/network/components/InviteResponsePage";

export const Route = createFileRoute("/_authenticated/invites/$inviteId")({
  component: InviteResponseRoute,
});

function InviteResponseRoute() {
  const { inviteId } = Route.useParams();
  return <InviteResponsePage inviteId={inviteId} />;
}
