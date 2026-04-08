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
import { useDebouncedCallback } from "@mantine/hooks";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { apiFetch, buildApiUrl } from "@/lib/api";
import { createUuidV7 } from "@/lib/id";
import type { TagDto } from "@/tags/models/tag";

const RANDOM_COLORS = [
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#fab005",
  "#fd7e14",
  "#fa5252",
  "#868e96",
];

function randomColor() {
  return RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
}

async function searchTags(search: string): Promise<TagDto[]> {
  const params = new URLSearchParams({ limit: "20" });
  if (search.trim().length >= 1) {
    params.set("search", search.trim());
  }
  const response = await apiFetch(buildApiUrl(`/tags?${params.toString()}`));
  if (!response.ok) throw new Error("Failed to search tags");
  return response.json();
}

async function quickCreateTag(name: string): Promise<TagDto> {
  const id = createUuidV7();
  const response = await apiFetch(buildApiUrl("/tags"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id.toString(),
      name: name.trim(),
      color: randomColor(),
      answerMode: { type: "timeblock" },
      notificationsSettings: {
        browserNotificationEnabled: false,
        soundNotificationEnabled: false,
      },
    }),
  });
  if (!response.ok) throw new Error("Failed to create tag");
  return response.json();
}

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagSelector({ selectedTagIds, onChange }: TagSelectorProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const queryClient = useQueryClient();

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
  }, 300);

  const { data: tags = [] } = useQuery({
    queryKey: ["tags-search", debouncedSearch],
    queryFn: () => searchTags(debouncedSearch),
    placeholderData: (prev) => prev,
  });

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreate = async () => {
    const trimmed = search.trim();
    if (!trimmed) return;

    const created = await quickCreateTag(trimmed);
    queryClient.invalidateQueries({ queryKey: ["tags-search"] });
    queryClient.invalidateQueries({ queryKey: ["tags"] });
    onChange([...selectedTagIds, created.id]);
    setSearch("");
    setDebouncedSearch("");
  };

  const hasExactMatch = tags.some(
    (t) => t.name.toLowerCase() === search.trim().toLowerCase(),
  );
  const showCreate = search.trim().length > 0 && !hasExactMatch;

  return (
    <Accordion variant="contained" radius="md">
      <Accordion.Item value="tags">
        <Accordion.Control icon={<IconSearch size={16} />}>
          {selectedTagIds.length > 0
            ? `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? "s" : ""} selected`
            : "Show tag selection"}
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="xs">
            <TextInput
              placeholder="Search tags..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                handleSearchChange(e.currentTarget.value);
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
                          <Text size="xs" c="dimmed">
                            {tag.description}
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
                      <Text size="sm">Create tag: {search.trim()}</Text>
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
