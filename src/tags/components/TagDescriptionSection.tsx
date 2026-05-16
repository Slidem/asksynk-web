import {
  Accordion,
  ActionIcon,
  Box,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconArrowBackUp, IconNote, IconPencil } from "@tabler/icons-react";

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

export function TagDescriptionSection({
  form,
  initialDescription = "",
  readonly = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(!readonly);
  const showReadonly = readonly && !isEditing;
  const { description: currentDescription } = form.getValues();

  return (
    <Accordion.Item value="description">
      <Accordion.Control icon={<IconNote size={16} />}>
        <Group justify="space-between" wrap="nowrap" pr="xs">
          <Text fw={500} size="sm">
            Description
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
                  aria-label="Edit description"
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
          currentDescription ? (
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
          )
        ) : (
          <TagDescriptionEditor form={form} initialContent={initialDescription} />
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
}
