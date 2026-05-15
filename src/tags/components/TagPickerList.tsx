import {
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
import { TagAvailabilityHint } from "@/tags/components/TagAvailabilityHint";
import { useUserTagsService } from "@/tags/hooks/useUserTagsService";

interface TagPickerListProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  /** When set, picker lists this user's tags; inline create is disabled. */
  targetUserId?: string;
  maxHeight?: number;
}

export function TagPickerList({
  selectedTagIds,
  onChange,
  targetUserId,
  maxHeight = 240,
}: TagPickerListProps) {
  const { tags, searchValue, setSearchValue, create, isCreating, canCreate } =
    useUserTagsService(targetUserId);

  const hasExactMatch = useMemo(
    () =>
      tags.some(
        (t) => t.name.toLowerCase() === searchValue.trim().toLowerCase(),
      ),
    [searchValue, tags],
  );

  const showCreate =
    canCreate && searchValue.trim().length > 0 && !hasExactMatch && !isCreating;

  const toggle = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreate = useCallback(() => {
    const id = create(searchValue.trim());
    if (!id) return;
    onChange([...selectedTagIds, id.toString()]);
    setSearchValue("");
  }, [create, onChange, searchValue, selectedTagIds, setSearchValue]);

  return (
    <Stack gap="xs">
      <TextInput
        placeholder="Search tags..."
        leftSection={<IconSearch size={12} />}
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && showCreate) {
            e.preventDefault();
            handleCreate();
          }
        }}
        data-autofocus
        autoFocus
      />
      <ScrollArea.Autosize mah={maxHeight}>
        <Stack gap={2}>
          {tags.map((tag) => (
            <UnstyledButton
              key={tag.id}
              onClick={() => toggle(tag.id)}
              py="xs"
              px="sm"
            >
              <Group gap="sm" wrap="nowrap">
                <Checkbox
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => toggle(tag.id)}
                  tabIndex={-1}
                  style={{ pointerEvents: "none" }}
                />
                <ColorSwatch color={tag.color} size={14} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={600} truncate>
                    {tag.name}
                  </Text>
                  {tag.description && (
                    <Text size="xs" c="dimmed" truncate>
                      {htmlToPreview(tag.description)}
                    </Text>
                  )}
                </div>
                <TagAvailabilityHint tag={tag} userId={targetUserId} />
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
          {tags.length === 0 && !showCreate && (
            <Text size="xs" c="dimmed" ta="center" py="md">
              No tags
            </Text>
          )}
        </Stack>
      </ScrollArea.Autosize>
    </Stack>
  );
}
