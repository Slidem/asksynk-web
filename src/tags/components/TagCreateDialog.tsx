import { Button, Group, Modal } from "@mantine/core";
import {
  useCreateTagDialogHandlers,
  useIsCreateTagDialogOpened,
} from "../hooks/dialogs/createTagDialogHooks";

import { DEFAULT_TAG_FORM_VALUES } from "@/tags/models/tagForm";
import { TagForm } from "@/tags/components/TagForm";
import type { TagFormValues } from "@/tags/models/tagForm";
import { createUuidV7 } from "@/lib/id";
import { tagFormValuesToInput } from "@/tags/utils/tagFormMapper";
import { useCreateTag } from "../hooks/mutations/useCreateTag";
import { useForm } from "@mantine/form";

export function TagCreateDialog() {
  const { createTag, isCreating } = useCreateTag();
  const isOpened = useIsCreateTagDialogOpened();
  const { close: closeDialog } = useCreateTagDialogHandlers();

  const form = useForm<TagFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_TAG_FORM_VALUES,
  });

  const handleClose = () => {
    form.reset();
    closeDialog();
  };

  const handleCreate = () => {
    const values = form.getValues();

    if (!values.name.trim()) {
      return;
    }

    createTag({
      id: createUuidV7(),
      ...tagFormValuesToInput(values),
    });
    handleClose();
  };

  return (
    <Modal
      opened={isOpened}
      onClose={handleClose}
      title={"Create new tag"}
      size="lg"
    >
      <TagForm form={form} />

      <Group justify="flex-end" mt="sm">
        <Button variant="default" onClick={handleClose}>
          Cancel
        </Button>
        <Button loading={isCreating} onClick={handleCreate}>
          Create tag
        </Button>
      </Group>
    </Modal>
  );
}
