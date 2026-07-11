import { Badge, Group, Tabs } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { usePublicPendingActionsCountQuery } from "@/public-schedule/hooks/queries/usePublicPendingActionsCountQuery";
import {
  isPublicViewTab,
  type PublicViewTab,
} from "@/public-schedule/models/publicViewTab";

interface Props {
  slug: string;
  activeTab: PublicViewTab;
}

export function PublicViewTabs({ slug, activeTab }: Props) {
  const navigate = useNavigate();
  const { data: pendingCount = 0 } = usePublicPendingActionsCountQuery(slug);

  const handleChange = (value: string | null) => {
    if (!isPublicViewTab(value)) return;
    navigate({
      to: "/public/$slug",
      params: { slug },
      search: value === "calendar" ? {} : { tab: value },
    });
  };

  return (
    <Tabs value={activeTab} onChange={handleChange} px="lg" pt="xs">
      <Tabs.List style={{ gap: "var(--mantine-spacing-md)" }}>
        <Tabs.Tab value="calendar" py="sm">
          Calendar
        </Tabs.Tab>
        <Tabs.Tab
          value="pending"
          py="sm"
          rightSection={
            pendingCount > 0 ? (
              <Group gap={4} wrap="nowrap">
                <IconBell size={14} />
                <Badge color="yellow" size="xs" circle>
                  {pendingCount}
                </Badge>
              </Group>
            ) : undefined
          }
        >
          Your items
        </Tabs.Tab>
        <Tabs.Tab value="messages" py="sm">
          Messages
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
