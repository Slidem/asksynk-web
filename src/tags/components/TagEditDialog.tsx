import { Accordion, Button, Group, Modal, Stack } from "@mantine/core";
import {
  tagDtoToFormValues,
  tagFormValuesToInput,
} from "@/tags/utils/tagFormMapper";
import {
  useEditTagDialogHandlers,
  useIsEditTagDialogOpened,
  useOnSelectedEditedTagChange,
  useOpenedEditTag,
} from "../hooks/dialogs/editTagDialogHooks";

import { TagNameSection } from "@/tags/components/TagNameSection";
import { TagDescriptionSection } from "@/tags/components/TagDescriptionSection";
import { TagNotificationsSection } from "@/tags/components/TagNotificationsSection";
import { TagPropertiesSection } from "@/tags/components/TagPropertiesSection";
import { TagUpcomingEventsSection } from "@/tags/components/TagUpcomingEventsSection";
import {
  DEFAULT_TAG_FORM_VALUES,
  type TagFormValues,
} from "@/tags/models/tagForm";
import { validateTagName } from "@/tags/utils/tagNameValidation";
import { useForm } from "@mantine/form";
import { useUpdateTagMutation } from "../hooks/mutations/useUpdateTag";

export function TagEditDialog() {
  const isOpened = useIsEditTagDialogOpened();
  const selectedTag = useOpenedEditTag();
  const editMutation = useUpdateTagMutation();
  const { close: closeDialog } = useEditTagDialogHandlers();

  const form = useForm<TagFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_TAG_FORM_VALUES,
    validate: { name: validateTagName },
    validateInputOnBlur: true,
  });

  useOnSelectedEditedTagChange((tag) => {
    if (tag) {
      form.setValues(tagDtoToFormValues(tag));
    }
  });

  const handleSave = () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    const values = form.getValues();
    editMutation.mutate({
      id: selectedTag!.id,
      ...tagFormValuesToInput(values),
    });

    closeDialog();
  };

  return (
    <Modal opened={isOpened} onClose={closeDialog} title="Tag details" size="lg">
      <Stack gap="md">
        {selectedTag && (
          <Accordion
            multiple
            defaultValue={["name", "description", "properties"]}
            variant="separated"
          >
            <TagNameSection form={form} readonly />
            <TagDescriptionSection
              form={form}
              initialDescription={selectedTag.description ?? ""}
              readonly
            />
            <TagPropertiesSection form={form} />
            <TagNotificationsSection form={form} />
            {selectedTag.answerMode.type === "timeblock" && (
              <TagUpcomingEventsSection tagId={selectedTag.id} />
            )}
          </Accordion>
        )}
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
