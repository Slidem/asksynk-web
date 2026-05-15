import { Container, Stack } from "@mantine/core";

import { InviteCreateDialog } from "@/network/components/InviteCreateDialog";
import { NetworkPageHeader } from "@/network/components/NetworkPageHeader";
import { NetworkTabs } from "@/network/components/NetworkTabs";
import { UserActionsDialog } from "@/network/components/UserActionsDialog";
import { UserAvailabilityDialog } from "@/network/components/UserAvailabilityDialog";

export function NetworkPage() {
  return (
    <Container size="xl" maw={1200} w="100%" py="lg">
      <Stack gap="lg">
        <NetworkPageHeader />
        <NetworkTabs />
      </Stack>

      <InviteCreateDialog />
      <UserActionsDialog />
      <UserAvailabilityDialog />
    </Container>
  );
}
