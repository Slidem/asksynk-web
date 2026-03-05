import { Button, Group, Modal } from "@mantine/core";
import {
  useCreateTagDialogHandlers,
  useIsCreateTagDialogOpened,
} from "../hooks/dialogs";

import { DEFAULT_TAG_FORM_VALUES } from "@/tags/models/tagForm";
import { TagForm } from "@/tags/components/TagForm";
import type { TagFormValues } from "@/tags/models/tagForm";
import { tagFormValuesToInput } from "../utils/tagFormMapper";
import { useCreateTagMutation } from "@/tags/hooks/mutations";
import { useForm } from "@mantine/form";

export function TagCreateDialog() {
  const createMutation = useCreateTagMutation();
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
    createMutation.mutate(tagFormValuesToInput(values));
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
        <Button loading={createMutation.isPending} onClick={handleCreate}>
          Create tag
        </Button>
      </Group>
    </Modal>
  );
}
