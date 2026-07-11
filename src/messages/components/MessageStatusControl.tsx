import { ActionIcon, Menu, Tooltip, UnstyledButton } from "@mantine/core";
import { Fragment } from "react";
import {
  IconArrowBackUp,
  IconCheck,
  IconCircleCheck,
  IconPlayerPlay,
} from "@tabler/icons-react";

import { AttentionItemStatusBadge } from "@/attentionItems/components/AttentionItemStatusBadge";
import type { AttentionItemStatus } from "@/attentionItems/models/attentionItem";
import { useUpdateMessageStatus } from "@/messages/hooks/useUpdateMessageStatus";

interface Props {
  threadId: string;
  messageId: string;
  status: AttentionItemStatus;
}

// Recipient-only status control on a tagged message. A one-click Resolve sits
// next to a badge-menu for the fuller transitions. The optimistic WS command
// keeps the thread live; the backend also syncs the recipient's inbox item.
export function MessageStatusControl({ threadId, messageId, status }: Props) {
  const { updateStatus } = useUpdateMessageStatus(threadId);
  const set = (next: AttentionItemStatus) => updateStatus(messageId, next);
  const isResolved = status === "resolved";

  return (
    <Fragment>
      <Menu position="bottom-start" withinPortal shadow="md">
        <Menu.Target>
          <UnstyledButton
            aria-label="Change status"
            style={{ cursor: "pointer", display: "inline-flex" }}
          >
            <AttentionItemStatusBadge status={status} radius="sm" />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          {status !== "in_progress" && (
            <Menu.Item
              leftSection={<IconPlayerPlay size={14} />}
              onClick={() => set("in_progress")}
            >
              Mark in progress
            </Menu.Item>
          )}
          {status !== "resolved" && (
            <Menu.Item
              leftSection={<IconCheck size={14} />}
              onClick={() => set("resolved")}
            >
              Resolve
            </Menu.Item>
          )}
          {status !== "created" && (
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
