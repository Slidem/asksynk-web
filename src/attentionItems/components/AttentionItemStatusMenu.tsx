import { ActionIcon, Menu } from "@mantine/core";
import {
  IconCheck,
  IconDotsVertical,
  IconPlayerPlay,
  IconTrash,
} from "@tabler/icons-react";

import type { AttentionItemDto } from "@/attentionItems/models/attentionItem";
import { useUpdateAttentionItem } from "@/attentionItems/hooks/mutations/useUpdateAttentionItem";
import { useDeleteAttentionItem } from "@/attentionItems/hooks/mutations/useDeleteAttentionItem";

interface Props {
  item: AttentionItemDto;
}

export function AttentionItemStatusMenu({ item }: Props) {
  const update = useUpdateAttentionItem();
  const remove = useDeleteAttentionItem();

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
        {item.status !== "in_progress" && (
          <Menu.Item
            leftSection={<IconPlayerPlay size={16} />}
            onClick={() =>
              update.mutate({ id: item.id, status: "in_progress" })
            }
          >
            Mark in progress
          </Menu.Item>
        )}
        {item.status !== "resolved" && (
          <Menu.Item
            leftSection={<IconCheck size={16} />}
            onClick={() => update.mutate({ id: item.id, status: "resolved" })}
          >
            Resolve
          </Menu.Item>
        )}
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconTrash size={16} />}
          color="red"
          onClick={() => remove.mutate(item.id)}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
