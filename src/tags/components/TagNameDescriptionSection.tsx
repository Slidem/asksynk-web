import {
  Accordion,
  ActionIcon,
  Box,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowBackUp,
  IconNote,
  IconPencil,
  IconTag,
} from "@tabler/icons-react";

import DOMPurify from "dompurify";
import { TagDescriptionEditor } from "@/tags/components/TagDescriptionEditor";
import type { TagFormValues } from "@/tags/models/tagForm";
import type { UseFormReturnType } from "@mantine/form";
import { useState } from "react";

interface Props {
  form: UseFormReturnType<TagFormValues>;
  initialDescription?: string;
  readonly?: boolean;
}

const ACCORDION_VALUE = "name-desc";

export function TagNameDescriptionSection({
  form,
  initialDescription = "",
  readonly = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(!readonly);
  const showReadonly = readonly && !isEditing;
  const { name: currentName, description: currentDescription } =
    form.getValues();

  return (
    <Accordion.Item value={ACCORDION_VALUE}>
      <Accordion.Control icon={<IconNote size={16} />}>
        <Group justify="space-between" wrap="nowrap" pr="xs">
          <Text fw={500} size="sm">
            Name & description
          </Text>
          {readonly &&
            (isEditing ? (
              <Tooltip label="Back" withArrow>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  aria-label="Back to readonly view"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(false);
                  }}
                >
                  <IconArrowBackUp size={14} />
                </ActionIcon>
              </Tooltip>
            ) : (
              <Tooltip label="Edit" withArrow>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  aria-label="Edit name and description"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  <IconPencil size={14} />
                </ActionIcon>
              </Tooltip>
            ))}
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {showReadonly ? (
          <Stack gap="xs">
            <Text fw={600} size="sm">
              {currentName || (
                <Text component="span" c="dimmed" fs="italic">
                  Untitled
                </Text>
              )}
            </Text>
            {currentDescription ? (
              <Box
                c="dimmed"
                fz="sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(currentDescription),
                }}
              />
            ) : (
              <Text size="sm" c="dimmed" fs="italic">
                No description
              </Text>
            )}
          </Stack>
        ) : (
          <Stack gap="sm">
            <TextInput
              label="Name"
              placeholder="Focus time"
              leftSection={<IconTag size={16} />}
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
            <Stack gap={4}>
              <Text size="sm" fw={500}>
                Description
              </Text>
              <TagDescriptionEditor
                form={form}
                initialContent={initialDescription}
              />
            </Stack>
          </Stack>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}
