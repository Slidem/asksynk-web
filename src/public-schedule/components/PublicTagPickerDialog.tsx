import {
  Button,
  Checkbox,
  ColorSwatch,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";

import { useUserTags } from "@/tags/hooks/queries/useUserTags";

interface Props {
  opened: boolean;
  ownerUserId: string;
  initialTagIds: string[];
  onConfirm: (tagIds: string[]) => void;
  onClose: () => void;
}

export function PublicTagPickerDialog({
  opened,
  ownerUserId,
  initialTagIds,
  onConfirm,
  onClose,
}: Props) {
  const { data: tags } = useUserTags(ownerUserId);
  const [tagIds, setTagIds] = useState<string[] | null>(null);

  const handleClose = () => {
    setTagIds(null);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Tag message" centered>
      <Stack gap="md">
        {!tags || tags.length === 0 ? (
          <Text size="sm" c="dimmed">
            No tags available yet.
          </Text>
        ) : (
          <Checkbox.Group value={tagIds ?? initialTagIds} onChange={setTagIds}>
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
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm(tagIds ?? initialTagIds);
              handleClose();
            }}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
