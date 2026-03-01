import { Button, Group, Modal } from "@mantine/core";

import { DEFAULT_TAG_FORM_VALUES } from "@/tags/models/tagForm";
import type { TagCreateInput } from "@/tags/models/tag";
import { TagForm } from "@/tags/components/TagForm";
import type { TagFormValues } from "@/tags/models/tagForm";
import { tagFormValuesToInput } from "@/tags/utils/tagFormMapper";
import { useForm } from "@mantine/form";

interface TagCreateModalProps {
  opened: boolean;
  loading?: boolean;
  onClose: () => void;
  onCreate: (input: TagCreateInput) => void;
}

export function TagCreateModal({
  opened,
  loading,
  onClose,
  onCreate,
}: TagCreateModalProps) {
  const form = useForm<TagFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_TAG_FORM_VALUES,
  });

  const handleCreate = () => {
    const values = form.getValues();
    if (!values.name.trim()) return;
    onCreate(tagFormValuesToInput(values));
  };

  return (
    <Modal opened={opened} onClose={onClose} title={"Create new tag"} size="lg">
      <TagForm form={form} />

      <Group justify="flex-end" mt="sm">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button loading={loading} onClick={handleCreate}>
          Create tag
        </Button>
      </Group>
    </Modal>
  );
}
