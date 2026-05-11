import { Badge, ColorSwatch, Group } from "@mantine/core";
import { useUserTags } from "@/tags/hooks/queries/useUserTags";

interface Props {
  tagIds: string[];
  /** Owner of the tags (recipient of the DM). Omit to fall back to caller's tags. */
  userId?: string;
}

export function TagChipsRow({ tagIds, userId }: Props) {
  const { data: allTags = [] } = useUserTags(userId);
  if (tagIds.length === 0) return null;

  const tags = tagIds
    .map((id) => allTags.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  if (tags.length === 0) return null;

  return (
    <Group gap={6} wrap="wrap">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          size="sm"
          variant="light"
          radius="sm"
          leftSection={<ColorSwatch color={tag.color} size={8} />}
        >
          {tag.name}
        </Badge>
      ))}
    </Group>
  );
}
