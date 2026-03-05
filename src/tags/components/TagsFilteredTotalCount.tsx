import { Text } from "@mantine/core";
import { useFilteredTagsCount } from "@/tags/hooks/queries";

export const TagsFilteredTotalCount = () => {
  const totalFilteredTags = useFilteredTagsCount();
  return (
    <Text size="sm" c="dimmed">
      {totalFilteredTags} tags powering your focus.
    </Text>
  );
};
