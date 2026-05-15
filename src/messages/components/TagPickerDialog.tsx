import { Button, Group, Modal, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { TagPickerList } from "@/tags/components/TagPickerList";

interface Props {
  opened: boolean;
  initialTagIds: string[];
  /** When set, picker lists this user's tags (recipient in DM context). */
  targetUserId?: string;
  title?: string;
  confirmLabel?: string;
  onConfirm: (tagIds: string[]) => void;
  onClose: () => void;
}

export function TagPickerDialog({
  opened,
  initialTagIds,
  targetUserId,
  title = "Select tags",
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
}: Props) {
  const [tagIds, setTagIds] = useState<string[]>(initialTagIds);
  const isMobile = useMediaQuery("(max-width: 48em)");

  useEffect(() => {
    if (opened) setTagIds(initialTagIds);
  }, [opened, initialTagIds]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="lg"
      fullScreen={isMobile}
      centered
    >
      <Stack gap="md">
        <TagPickerList
          selectedTagIds={tagIds}
          onChange={setTagIds}
          targetUserId={targetUserId}
        />
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
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
