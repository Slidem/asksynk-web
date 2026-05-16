import {
  Accordion,
  ActionIcon,
  Group,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconArrowBackUp, IconPencil, IconTag } from "@tabler/icons-react";

import type { TagFormValues } from "@/tags/models/tagForm";
import type { UseFormReturnType } from "@mantine/form";
import { useState } from "react";

interface Props {
  form: UseFormReturnType<TagFormValues>;
  readonly?: boolean;
}

export function TagNameSection({ form, readonly = false }: Props) {
  const [isEditing, setIsEditing] = useState(!readonly);
  const showReadonly = readonly && !isEditing;
  const { name: currentName } = form.getValues();

  return (
    <Accordion.Item value="name">
      <Accordion.Control icon={<IconTag size={16} />}>
        <Group justify="space-between" wrap="nowrap" pr="xs">
          <Text fw={500} size="sm">
            Name
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
                  aria-label="Edit name"
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
          <Text fw={700} size="xl">
            {currentName || (
              <Text component="span" c="dimmed" fs="italic" fw={400} size="xl">
                Untitled
              </Text>
            )}
          </Text>
        ) : (
          <TextInput
            placeholder="Focus time"
            leftSection={<IconTag size={16} />}
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}
