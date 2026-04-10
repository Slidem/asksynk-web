import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import { IconPlus, IconTags } from "@tabler/icons-react";

import { TagsFilteredTotalCount } from "./TagsFilteredTotalCount";
import { TagsFilters } from "@/tags/components/TagsFilters";
import { useCreateTagDialogHandlers } from "../hooks/dialogs/createTagDialogHooks";

export function TagsPageHeader() {
  const { open: openCreateDialog } = useCreateTagDialogHandlers();

  return (
    <Paper p="lg" radius="lg" shadow="sm" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="wrap">
          <Stack gap={4}>
            <Group gap="xs">
              <IconTags size={22} />
              <Title order={2}>Tags</Title>
            </Group>
            <TagsFilteredTotalCount />
          </Stack>

          <Button
            leftSection={<IconPlus size={18} />}
            onClick={openCreateDialog}
          >
            Create new
          </Button>
        </Group>

        <TagsFilters />
      </Stack>
    </Paper>
  );
}
