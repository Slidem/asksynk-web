import {
  Button,
  Checkbox,
  ColorSwatch,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";

import { usePublicTagsQuery } from "@/public-schedule/hooks/queries/usePublicTagsQuery";

interface Props {
  opened: boolean;
  slug: string;
  initialTagIds: string[];
  onConfirm: (tagIds: string[]) => void;
  onClose: () => void;
}

export function PublicTagPickerDialog({
  opened,
  slug,
  initialTagIds,
  onConfirm,
  onClose,
}: Props) {
  const { data: tags } = usePublicTagsQuery(slug);
  const [tagIds, setTagIds] = useState<string[]>(initialTagIds);

  useEffect(() => {
    if (opened) {
      setTagIds(initialTagIds);
    }
  }, [opened, initialTagIds]);

  return (
    <Modal opened={opened} onClose={onClose} title="Tag message" centered>
      <Stack gap="md">
        {!tags || tags.length === 0 ? (
          <Text size="sm" c="dimmed">
            No tags available yet.
          </Text>
        ) : (
          <Checkbox.Group value={tagIds} onChange={setTagIds}>
            <Stack gap="xs">
              {tags.map((tag) => (
                <Checkbox
                  key={tag.id}
                  value={tag.id}
                  label={
                    <Group gap="xs" wrap="nowrap">
                      <ColorSwatch color={tag.color} size={12} />
                      <Text size="sm">{tag.name}</Text>
                    </Group>
                  }
                />
              ))}
            </Stack>
          </Checkbox.Group>
        )}
        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(tagIds);
              onClose();
            }}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
