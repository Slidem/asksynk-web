import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  tagDtoToFormValues,
  tagFormValuesToInput,
} from "@/tags/utils/tagFormMapper";

import { IconTag } from "@tabler/icons-react";
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
    <Modal opened={opened} onClose={onClose} title="Tag details" size="lg">
      <Stack gap="md">
        <Paper p="md" radius="md" withBorder>
          <Group align="center" gap="md" wrap="nowrap">
            <ThemeIcon variant="light" color={tag.color} radius="xl" size={48}>
              <IconTag size={24} />
            </ThemeIcon>
            <Stack gap={4}>
              <Text fw={700} size="md">
                {tag.name}
              </Text>
              {tag.description && (
                <Text size="sm" c="dimmed">
                  {tag.description}
                </Text>
              )}
              <Group gap="xs" mt={8}>
                <Badge variant="light">
                  {tag.answerMode.type === "immediately"
                    ? "Immediate"
                    : "Timeblock"}
                </Badge>
                {tag.answerMode.type === "immediately" && (
                  <Badge variant="light">
                    {formatResponseTime(tag.answerMode.responseTimeMillis)}
                  </Badge>
                )}
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
