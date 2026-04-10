import { Center, Loader, SimpleGrid, Text } from "@mantine/core";

import { TagCard } from "./TagCard";
import { useFilteredTags } from "../hooks/queries/useFilteredTags";

export const TagCards = () => {
  const { data: tags, isLoading, isError } = useFilteredTags();
  return (
    <>
      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : isError ? (
        <Text c="red">Failed to load tags.</Text>
      ) : tags?.length === 0 ? (
        <Text c="dimmed">No tags yet. Create your first one.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {tags?.map((tag) => (
            <TagCard key={tag.id} tag={tag} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};
