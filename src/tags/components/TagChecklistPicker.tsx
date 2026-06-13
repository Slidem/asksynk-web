import {
  Accordion,
  Checkbox,
  ColorSwatch,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";

import { htmlToPreview } from "@/lib/htmlToPreview";
import { TagAvailabilityHint } from "@/tags/components/TagAvailabilityHint";
import type { TagDto } from "@/tags/models/tag";

interface TagChecklistPickerProps {
  tags: TagDto[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreate?: () => void;
  showCreate?: boolean;
  disabled?: boolean;
  // Renders the approximate answer time per tag; hintUserId targets whose
  // calendar drives timeblock hints (undefined = own).
  withAvailabilityHints?: boolean;
  hintUserId?: string;
}

export function TagChecklistPicker({
  tags,
  selectedTagIds,
  onChange,
  searchValue,
  onSearchChange,
  onCreate,
  showCreate = false,
  disabled = false,
  withAvailabilityHints = false,
  hintUserId,
}: TagChecklistPickerProps) {
  // Controlled accordion so rows (and their per-tag availability queries) only
  // mount when the panel is open.
  const [openedItem, setOpenedItem] = useState<string | null>(null);

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <Accordion
      variant="contained"
      radius="md"
      value={disabled ? null : openedItem}
      onChange={setOpenedItem}
    >
      <Accordion.Item value="tags">
        <Accordion.Control icon={<IconSearch size={12} />} disabled={disabled}>
          {selectedTagIds.length > 0
            ? `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? "s" : ""} selected`
            : "Show tag selection"}
        </Accordion.Control>
        <Accordion.Panel>
          {openedItem === "tags" && (
            <Stack gap="xs">
              <TextInput
                placeholder="Search tags..."
                leftSection={<IconSearch size={12} />}
                value={searchValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && showCreate && onCreate) {
                    onCreate();
                  }
                }}
                onChange={(e) => {
                  onSearchChange(e.currentTarget.value);
                }}
              />
              <ScrollArea.Autosize mah={200}>
                <Stack gap={4}>
                  {tags.map((tag) => (
                    <UnstyledButton
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      py="xs"
                      px="sm"
                    >
                      <Group gap="sm" wrap="nowrap">
                        <Checkbox
                          checked={selectedTagIds.includes(tag.id)}
                          onChange={() => toggleTag(tag.id)}
                          tabIndex={-1}
                          style={{ pointerEvents: "none" }}
                        />
                        <ColorSwatch color={tag.color} size={14} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text size="sm" fw={600}>
                            {tag.name}
                          </Text>
                          {tag.description && (
                            <Text size="xs" c="dimmed" lineClamp={1}>
                              {htmlToPreview(tag.description)}
                            </Text>
                          )}
                        </div>
                        {withAvailabilityHints && (
                          <TagAvailabilityHint tag={tag} userId={hintUserId} />
                        )}
                      </Group>
                    </UnstyledButton>
                  ))}
                  {showCreate && onCreate && (
                    <UnstyledButton onClick={onCreate} py="xs" px="sm">
                      <Group gap="sm">
                        <IconPlus size={16} />
                        <Text size="sm">Create tag: {searchValue.trim()}</Text>
                      </Group>
                    </UnstyledButton>
                  )}
                </Stack>
              </ScrollArea.Autosize>
            </Stack>
          )}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
