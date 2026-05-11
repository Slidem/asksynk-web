import { ColorSwatch, Group, Pill, Text, UnstyledButton } from "@mantine/core";
import { IconHash, IconX } from "@tabler/icons-react";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useUserTags } from "@/tags/hooks/queries/useUserTags";
import type { TaggedThreadMarkerOptions } from "@/messages/tiptap/TaggedThreadMarker";
import classes from "@/messages/tiptap/TaggedThreadMarkerView.module.css";

export function TaggedThreadMarkerView(props: ReactNodeViewProps) {
  const { node, getPos, deleteNode, updateAttributes, extension } = props;
  const tagIds = (node.attrs.tagIds as string[]) ?? [];
  const opts = extension.options as TaggedThreadMarkerOptions;
  const { data: allTags = [] } = useUserTags(opts.recipientUserId ?? undefined);

  const tags = tagIds
    .map((id) => allTags.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const requestEdit = () => {
    const pos = typeof getPos === "function" ? getPos() : null;
    if (pos == null) return;
    opts.onRequestEdit(pos, tagIds);
  };

  const removeTag = (tagId: string) => {
    const next = tagIds.filter((id) => id !== tagId);
    if (next.length === 0) {
      deleteNode();
      return;
    }
    updateAttributes({ tagIds: next });
  };

  return (
    <NodeViewWrapper
      className={classes.wrapper}
      contentEditable={false}
      data-drag-handle
    >
      <Group gap="xs" wrap="wrap" align="center">
        <UnstyledButton
          onClick={requestEdit}
          className={classes.label}
          aria-label="Edit tags"
        >
          <IconHash size={14} />
          <Text size="xs" fw={600}>
            Tagged thread
          </Text>
        </UnstyledButton>
        {tags.map((tag) => (
          <Pill
            key={tag.id}
            withRemoveButton
            onRemove={() => removeTag(tag.id)}
            className={classes.pill}
          >
            <Group gap={6} wrap="nowrap">
              <ColorSwatch color={tag.color} size={10} />
              <span>{tag.name}</span>
            </Group>
          </Pill>
        ))}
        <UnstyledButton
          onClick={() => deleteNode()}
          aria-label="Remove tagged thread"
          className={classes.remove}
        >
          <IconX size={14} />
        </UnstyledButton>
      </Group>
    </NodeViewWrapper>
  );
}
