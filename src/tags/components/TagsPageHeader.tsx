import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconPlus, IconTags } from "@tabler/icons-react";

import { TagsFilters } from "@/tags/components/TagsFilters";
import type { TagsFiltersValue } from "@/tags/components/TagsFilters";

interface TagsPageHeaderProps {
  totalCount: number;
  filters: TagsFiltersValue;
  onFiltersChange: (value: TagsFiltersValue) => void;
  onCreate: () => void;
}

export function TagsPageHeader({
  totalCount,
  filters,
  onFiltersChange,
  onCreate,
}: TagsPageHeaderProps) {
  return (
    <Paper p="lg" radius="lg" shadow="sm">
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="wrap">
          <Stack gap={4}>
            <Group gap="xs">
              <IconTags size={22} />
              <Title order={2}>Tags</Title>
            </Group>
            <Text size="sm" c="dimmed">
              {totalCount} tags powering your focus.
            </Text>
          </Stack>

          <Button leftSection={<IconPlus size={18} />} onClick={onCreate}>
            Create new
          </Button>
        </Group>

        <TagsFilters value={filters} onChange={onFiltersChange} />
      </Stack>
    </Paper>
  );
}
