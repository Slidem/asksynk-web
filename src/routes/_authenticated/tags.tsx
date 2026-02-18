import {
  Center,
  Container,
  Loader,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import type { TagCreateInput, TagDto } from "@/tags/models/tag";
import { tagFormValuesToInput } from "@/tags/utils/tagFormMapper";
import { tagsQueryKey, useTagsQuery } from "@/tags/hooks/queries";
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useUpdateTagMutation,
} from "@/tags/hooks/mutations";
import { useMemo, useState } from "react";

import { TagCard } from "@/tags/components/TagCard";
import { TagCreateModal } from "@/tags/components/TagCreateModal";
import { TagDetailsModal } from "@/tags/components/TagDetailsModal";
import type { TagsFiltersValue } from "@/tags/components/TagsFilters";
import { TagsPageHeader } from "@/tags/components/TagsPageHeader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tags")({
  component: TagsPage,
});

function TagsPage() {
  const [filters, setFilters] = useState<TagsFiltersValue>({
    search: "",
    answerMode: "all",
    orderBy: "updatedAt",
    orderDirection: "desc",
  });
  const [createOpened, setCreateOpened] = useState(false);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagDto | null>(null);

  const queryFilters = useMemo(() => ({ ...filters, limit: 50 }), [filters]);
  const queryKey = tagsQueryKey(queryFilters);
  const { data: tags = [], isLoading, isError } = useTagsQuery(queryFilters);
  const createMutation = useCreateTagMutation(queryKey);
  const updateMutation = useUpdateTagMutation(queryKey);
  const deleteMutation = useDeleteTagMutation(queryKey);

  const handleOpenDetails = (tag: TagDto) => {
    setSelectedTag(tag);
    setDetailsOpened(true);
  };

  const handleDelete = (tag: TagDto) => {
    deleteMutation.mutate(tag.id);

    if (selectedTag?.id === tag.id) {
      setDetailsOpened(false);
      setSelectedTag(null);
    }
  };

  const handleCreate = (input: TagCreateInput) => {
    if (!input.name.trim()) return;

    createMutation.mutate(input);
    setCreateOpened(false);
  };

  const handleSave = (
    tag: TagDto,
    updates: ReturnType<typeof tagFormValuesToInput>,
  ) => {
    if (!updates.name.trim()) return;

    updateMutation.mutate({ id: tag.id, ...updates });
    setDetailsOpened(false);
  };

  return (
    <Container size="xl" maw={1200} w="100%" py="lg">
      <Stack gap="lg">
        <TagsPageHeader
          totalCount={tags.length}
          filters={filters}
          onFiltersChange={setFilters}
          onCreate={() => setCreateOpened(true)}
        />

        {isLoading ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : isError ? (
          <Text c="red">Failed to load tags.</Text>
        ) : tags.length === 0 ? (
          <Text c="dimmed">No tags yet. Create your first one.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            {tags.map((tag) => (
              <TagCard
                key={tag.id}
                tag={tag}
                onOpen={handleOpenDetails}
                onEdit={handleOpenDetails}
                onDelete={handleDelete}
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>

      {createOpened && (
        <TagCreateModal
          opened={createOpened}
          loading={createMutation.isPending}
          onClose={() => setCreateOpened(false)}
          onCreate={handleCreate}
        />
      )}

      {detailsOpened && selectedTag && (
        <TagDetailsModal
          opened={detailsOpened}
          tag={selectedTag}
          loading={updateMutation.isPending}
          onClose={() => setDetailsOpened(false)}
          onSave={handleSave}
        />
      )}
    </Container>
  );
}
