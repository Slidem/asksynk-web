import { Button, Group, Modal, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
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
  // null = untouched this open → fall back to initialTagIds; reset on close.
  const [tagIds, setTagIds] = useState<string[] | null>(null);
  const isMobile = useMediaQuery("(max-width: 48em)");

  const handleClose = () => {
    setTagIds(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={title}
      size="lg"
      fullScreen={isMobile}
      centered
    >
      <Stack gap="md">
        <TagPickerList
          selectedTagIds={tagIds ?? initialTagIds}
          onChange={setTagIds}
          targetUserId={targetUserId}
        />
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
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
