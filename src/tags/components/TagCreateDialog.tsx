import { Accordion, Button, Group, Modal } from "@mantine/core";
import {
  useCreateTagDialogHandlers,
  useIsCreateTagDialogOpened,
} from "../hooks/dialogs/createTagDialogHooks";

import { DEFAULT_TAG_FORM_VALUES } from "@/tags/models/tagForm";
import { TagNameDescriptionSection } from "@/tags/components/TagNameDescriptionSection";
import { TagNotificationsSection } from "@/tags/components/TagNotificationsSection";
import { TagPropertiesSection } from "@/tags/components/TagPropertiesSection";
import type { TagFormValues } from "@/tags/models/tagForm";
import { createUuidV7 } from "@/lib/id";
import { tagFormValuesToInput } from "@/tags/utils/tagFormMapper";
import { validateTagName } from "@/tags/utils/tagNameValidation";
import { useCreateTag } from "../hooks/mutations/useCreateTag";
import { useForm } from "@mantine/form";

export function TagCreateDialog() {
  const { createTag, isCreating } = useCreateTag();
  const isOpened = useIsCreateTagDialogOpened();
  const { close: closeDialog } = useCreateTagDialogHandlers();

  const form = useForm<TagFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_TAG_FORM_VALUES,
    validate: { name: validateTagName },
    validateInputOnBlur: true,
  });

  const handleClose = () => {
    form.reset();
    closeDialog();
  };

  const handleCreate = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    const values = form.getValues();
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
      <Accordion
        multiple
        defaultValue={["name-desc", "properties"]}
        variant="separated"
      >
        <TagNameDescriptionSection form={form} />
        <TagPropertiesSection form={form} />
        <TagNotificationsSection form={form} />
      </Accordion>

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
