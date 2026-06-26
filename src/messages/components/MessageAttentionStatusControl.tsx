import { ActionIcon, Menu, Tooltip, UnstyledButton } from "@mantine/core";
import { Fragment } from "react";
import {
  IconArrowBackUp,
  IconCheck,
  IconCircleCheck,
  IconPlayerPlay,
} from "@tabler/icons-react";

import { AttentionItemStatusBadge } from "@/attentionItems/components/AttentionItemStatusBadge";
import { useUpdateAttentionItem } from "@/attentionItems/hooks/mutations/useUpdateAttentionItem";
import type {
  AttentionItemDto,
  AttentionItemStatus,
} from "@/attentionItems/models/attentionItem";

interface Props {
  item: AttentionItemDto;
}

// Owner-only status control on a tagged message assigned to the viewer. A direct
// one-click Resolve sits next to a badge-menu for the fuller transitions. The
// optimistic mutation writes the shared ['attention-items'] cache, so the
// dashboard reflects the change (and dashboard changes reflect back here via
// attention.upserted).
export function MessageAttentionStatusControl({ item }: Props) {
  const update = useUpdateAttentionItem();
  const set = (status: AttentionItemStatus) =>
    update.mutate({ id: item.id, status });
  const isResolved = item.status === "resolved";

  // Renders as siblings (no wrapper) so the badge + resolve sit on the same
  // centerline as the tag chips in the parent row.
  return (
    <Fragment>
      <Menu position="bottom-start" withinPortal shadow="md">
        <Menu.Target>
          <UnstyledButton
            aria-label="Change status"
            style={{ cursor: "pointer", display: "inline-flex" }}
          >
            <AttentionItemStatusBadge status={item.status} radius="sm" />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
        {item.status !== "in_progress" && (
          <Menu.Item
            leftSection={<IconPlayerPlay size={14} />}
            onClick={() => set("in_progress")}
          >
            Mark in progress
          </Menu.Item>
        )}
        {item.status !== "resolved" && (
          <Menu.Item
            leftSection={<IconCheck size={14} />}
            onClick={() => set("resolved")}
          >
            Resolve
          </Menu.Item>
        )}
        {item.status !== "created" && (
          <Menu.Item
            leftSection={<IconArrowBackUp size={14} />}
            onClick={() => set("created")}
          >
            Reopen
          </Menu.Item>
        )}
        </Menu.Dropdown>
      </Menu>
      {!isResolved && (
        <Tooltip label="Resolve" withArrow>
          <ActionIcon
            variant="subtle"
            color="green"
            size="sm"
            aria-label="Resolve"
            onClick={() => set("resolved")}
          >
            <IconCircleCheck size={16} />
          </ActionIcon>
        </Tooltip>
      )}
    </Fragment>
  );
}
