import { ActionIcon, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconCheck,
  IconDotsVertical,
  IconPlayerPlay,
  IconTrash,
} from "@tabler/icons-react";

import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { useUpdateAttentionItemStatus } from "@/attentionItems/hooks/mutations/useUpdateAttentionItemStatus";
import { useDeleteAttentionItem } from "@/attentionItems/hooks/mutations/useDeleteAttentionItem";

// Sources whose status can be changed from the item (see
// updateAttentionItemSourceStatus). Batches/suggestions act via their bodies.
const STATUS_EDITABLE_KINDS = new Set(["message", "task"]);

interface Props {
  item: AttentionItemDto;
}

export function AttentionItemStatusMenu({ item }: Props) {
  const { updateStatus } = useUpdateAttentionItemStatus();
  const remove = useDeleteAttentionItem();
  const canEditStatus = STATUS_EDITABLE_KINDS.has(item.source.kind);

  const confirmDismiss = () =>
    modals.openConfirmModal({
      title: "Dismiss item?",
      centered: true,
      children: (
        <Text size="sm">
          This is permanent: later changes to the source won't bring it back.
        </Text>
      ),
      labels: { confirm: "Dismiss", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => remove.mutate(item.id),
    });

  return (
    <Menu position="bottom-end" shadow="md" withinPortal>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={(event) => event.stopPropagation()}
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
        {canEditStatus && item.status !== "in_progress" && (
          <Menu.Item
            leftSection={<IconPlayerPlay size={16} />}
            onClick={() => updateStatus({ item, status: "in_progress" })}
          >
            Mark in progress
          </Menu.Item>
        )}
        {canEditStatus && item.status !== "resolved" && (
          <Menu.Item
            leftSection={<IconCheck size={16} />}
            onClick={() => updateStatus({ item, status: "resolved" })}
          >
            Resolve
          </Menu.Item>
        )}
        {canEditStatus && <Menu.Divider />}
        <Menu.Item
          leftSection={<IconTrash size={16} />}
          color="red"
          onClick={confirmDismiss}
        >
          Dismiss
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
