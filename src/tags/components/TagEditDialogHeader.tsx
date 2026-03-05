import { Badge, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";

import { IconTag } from "@tabler/icons-react";
import type { TagDto } from "../models/tag";
import { formatResponseTime } from "@/tags/utils/responseTime";

export const TagEditDialogHeader = ({
  selectedTag,
}: {
  selectedTag: TagDto;
}) => {
  return (
    <Paper p="md" radius="md" withBorder>
      <Group align="center" gap="md" wrap="nowrap">
        <ThemeIcon
          variant="light"
          color={selectedTag.color}
          radius="xl"
          size={48}
        >
          <IconTag size={24} />
        </ThemeIcon>
        <Stack gap={4}>
          <Text fw={700} size="md">
            {selectedTag.name}
          </Text>
          {selectedTag.description && (
            <Text size="sm" c="dimmed">
              {selectedTag.description}
            </Text>
          )}
          <Group gap="xs" mt={8}>
            <Badge variant="light">
              {selectedTag.answerMode.type === "immediately"
                ? "Immediate"
                : "Timeblock"}
            </Badge>
            {selectedTag.answerMode.type === "immediately" && (
              <Badge variant="light">
                {formatResponseTime(selectedTag.answerMode.responseTimeMillis)}
              </Badge>
            )}
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
};
