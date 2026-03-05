import {
  tagDtoToFormValues,
  tagFormValuesToInput,
} from "@/tags/utils/tagFormMapper";
import { Button, Divider, Group, Modal, Stack } from "@mantine/core";
import {
  useEditTagDialogHandlers,
  useIsEditTagDialogOpened,
  useOnSelectedEditedTagChange,
  useOpenedEditTag,
} from "../hooks/dialogs";

import { TagForm } from "@/tags/components/TagForm";
import {
  DEFAULT_TAG_FORM_VALUES,
  type TagFormValues,
} from "@/tags/models/tagForm";
import { useForm } from "@mantine/form";
import { useUpdateTagMutation } from "../hooks/mutations";
import { TagEditDialogHeader } from "./TagEditDialogHeader";

export function TagEditDialog() {
  const isOpened = useIsEditTagDialogOpened();
  const selectedTag = useOpenedEditTag();
  const editMutation = useUpdateTagMutation();
  const { close: closeDialog } = useEditTagDialogHandlers();

  const form = useForm<TagFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_TAG_FORM_VALUES,
  });

  useOnSelectedEditedTagChange((tag) => {
    if (tag) {
      form.setValues(tagDtoToFormValues(tag));
    }
  });

  const handleSave = () => {
    const values = form.getValues();
    if (!values.name.trim()) {
      return;
    }
    editMutation.mutate({
      id: selectedTag!.id,
      ...tagFormValuesToInput(values),
    });

    closeDialog();
  };

  return (
    <Modal
      opened={isOpened}
      onClose={closeDialog}
      title="Tag details"
      size="lg"
    >
      <Stack gap="md">
        {selectedTag && <TagEditDialogHeader selectedTag={selectedTag} />}
        <Divider />
        <TagForm form={form} />
        <Group justify="flex-end">
          <Button variant="default" onClick={closeDialog}>
            Cancel
          </Button>
          <Button loading={editMutation.isPending} onClick={handleSave}>
            Save changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
