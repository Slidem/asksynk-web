import { Badge, Tabs } from "@mantine/core";

import { ConnectionsList } from "@/network/components/ConnectionsList";
import { ReceivedInvitesList } from "@/network/components/ReceivedInvitesList";
import { SentInvitesList } from "@/network/components/SentInvitesList";
import {
  useNetworkTab,
  useNetworkTabHandlers,
} from "@/network/hooks/networkTab";
import { useReceivedInvitesQuery } from "@/network/hooks/queries/useReceivedInvitesQuery";
import type { NetworkTab } from "@/network/store/networkTabStore";

export function NetworkTabs() {
  const tab = useNetworkTab();
  const { setTab } = useNetworkTabHandlers();
  const { data: received } = useReceivedInvitesQuery();

  const pendingCount = (received ?? []).filter(
    (i) => i.status === "pending",
  ).length;

  return (
    <Tabs
      value={tab}
      onChange={(value) => value && setTab(value as NetworkTab)}
      keepMounted={false}
    >
      <Tabs.List>
        <Tabs.Tab value="connections">Connections</Tabs.Tab>
        <Tabs.Tab
          value="received"
          rightSection={
            pendingCount > 0 ? (
              <Badge color="yellow" size="xs" circle>
                {pendingCount}
              </Badge>
            ) : null
          }
        >
          Received
        </Tabs.Tab>
        <Tabs.Tab value="sent">Sent</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="connections" pt="md">
        <ConnectionsList />
      </Tabs.Panel>
      <Tabs.Panel value="received" pt="md">
        <ReceivedInvitesList />
      </Tabs.Panel>
      <Tabs.Panel value="sent" pt="md">
        <SentInvitesList />
      </Tabs.Panel>
    </Tabs>
  );
}
