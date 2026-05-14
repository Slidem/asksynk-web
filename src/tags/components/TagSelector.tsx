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

import { useCallback, useMemo } from "react";
import { htmlToPreview } from "@/lib/htmlToPreview";
import { useTimeblockTagsService } from "../hooks/useTimeblockTagsService";

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagSelector({ selectedTagIds, onChange }: TagSelectorProps) {
  const { tags, searchValue, setSearchValue, create, isCreating } =
    useTimeblockTagsService();

  const hasExactMatch = useMemo(
    () =>
      tags.some(
        (t) => t.name.toLowerCase() === searchValue.trim().toLowerCase(),
      ),
    [searchValue, tags],
  );

  const showCreate = useMemo(
    () => searchValue.trim().length > 0 && !hasExactMatch && !isCreating,
    [searchValue, hasExactMatch, isCreating],
  );

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreate = useCallback(() => {
    const createdId = create(searchValue.trim());
    if (!createdId) {
      return;
    }
    onChange([...selectedTagIds, createdId.toString()]);
    setSearchValue("");
  }, [create, onChange, searchValue, selectedTagIds, setSearchValue]);

  return (
    <Accordion variant="contained" radius="md">
      <Accordion.Item value="tags">
        <Accordion.Control icon={<IconSearch size={12} />}>
          {selectedTagIds.length > 0
            ? `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? "s" : ""} selected`
            : "Show tag selection"}
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="xs">
            <TextInput
              placeholder="Search tags..."
              leftSection={<IconSearch size={12} />}
              value={searchValue}
              onKeyDown={(e) => {
                if (e.key === "Enter" && showCreate) {
                  handleCreate();
                }
              }}
              onChange={(e) => {
                setSearchValue(e.currentTarget.value);
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
                      <div>
                        <Text size="sm" fw={600}>
                          {tag.name}
                        </Text>
                        {tag.description && (
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {htmlToPreview(tag.description)}
                          </Text>
                        )}
                      </div>
                    </Group>
                  </UnstyledButton>
                ))}
                {showCreate && (
                  <UnstyledButton onClick={handleCreate} py="xs" px="sm">
                    <Group gap="sm">
                      <IconPlus size={16} />
                      <Text size="sm">Create tag: {searchValue.trim()}</Text>
                    </Group>
                  </UnstyledButton>
                )}
              </Stack>
            </ScrollArea.Autosize>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
