import {
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  alpha,
} from "@mantine/core";
import {
  tagDtoToFormValues,
  tagFormValuesToInput,
} from "@/tags/utils/tagFormMapper";

import type { TagDto } from "@/tags/models/tag";
import { TagForm } from "@/tags/components/TagForm";
import type { TagFormValues } from "@/tags/models/tagForm";
import { formatResponseTime } from "@/tags/utils/responseTime";
import { useForm } from "@mantine/form";

interface TagDetailsModalProps {
  opened: boolean;
  tag: TagDto;
  loading?: boolean;
  onClose: () => void;
  onSave: (
    tag: TagDto,
    updates: ReturnType<typeof tagFormValuesToInput>,
  ) => void;
}

export function TagDetailsModal({
  opened,
  tag,
  loading,
  onClose,
  onSave,
}: TagDetailsModalProps) {
  const form = useForm<TagFormValues>({
    mode: "uncontrolled",
    initialValues: tagDtoToFormValues(tag),
  });

  const handleSave = () => {
    const values = form.getValues();
    if (!values.name.trim()) return;
    onSave(tag, tagFormValuesToInput(values));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Tag details</Title>}
      size="lg"
    >
      <Stack gap="md">
        <Paper p="md" radius="md" withBorder>
          <Group align="center" gap="md">
            <Box
              w={56}
              h={56}
              style={{
                borderRadius: 16,
                background: `linear-gradient(135deg, ${tag.color} 0%, ${alpha(
                  tag.color,
                  0.6,
                )} 100%)`,
                boxShadow: `0 4px 8px ${alpha(tag.color, 0.15)}`,
              }}
            />
            <Stack gap={4}>
              <Text fw={600}>{tag.name}</Text>
              <Text size="sm" c="dimmed">
                {tag.description || "No description set."}
              </Text>
              <Group gap="xs">
                <Badge variant="light">
                  {tag.answerMode === "immediately" ? "Immediate" : "Timeblock"}
                </Badge>
                <Badge variant="light">
                  {formatResponseTime(tag.responseTimeMillis)}
                </Badge>
              </Group>
            </Stack>
          </Group>
        </Paper>

        <Divider />

        <TagForm form={form} />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSave}>
            Save changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
