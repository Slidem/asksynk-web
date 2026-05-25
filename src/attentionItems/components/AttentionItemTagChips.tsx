import { Badge, Group } from "@mantine/core";
import { useUserTags } from "@/tags/hooks/queries/useUserTags";
import type { TagDto } from "@/tags/models/tag";

const TAG_LIMIT = 3;

interface Props {
  tagIds: string[];
}

export function AttentionItemTagChips({ tagIds }: Props) {
  const { data: tags } = useUserTags();
  if (tagIds.length === 0) return null;

  const tagsMap = new Map((tags ?? []).map((t) => [t.id, t]));
  const resolved = tagIds
    .map((id) => tagsMap.get(id))
    .filter((tag): tag is TagDto => Boolean(tag));

  if (resolved.length === 0) return null;

  return (
    <Group gap={4} wrap="nowrap">
      {resolved.slice(0, TAG_LIMIT).map((tag) => (
        <Badge
          key={tag.id}
          size="xs"
          variant="dot"
          color={tag.color}
          styles={{
            label: { overflow: "hidden", textOverflow: "ellipsis" },
          }}
        >
          {tag.name}
        </Badge>
      ))}
      {resolved.length > TAG_LIMIT && (
        <Badge size="xs" variant="light" color="gray">
          +{resolved.length - TAG_LIMIT}
        </Badge>
      )}
    </Group>
  );
}
