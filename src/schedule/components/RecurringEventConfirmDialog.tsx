import { Button, Group, Modal, Stack, Text } from "@mantine/core";

import {
  useCancelOccurrenceMutation,
  useDeleteCalendarEventMutation,
  useDetachInstanceMutation,
  useSplitSeriesMutation,
} from "@/schedule/hooks/mutations";
import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";
import { useManageRecurringEventDialog } from "../hooks/useManageRecurringEventDialog";
import { useRecurringEventDialogData } from "../hooks/useRecurringEventDialogData";
import { toISOStringWithTimezone } from "@/lib/date";

export function RecurringEventConfirmDialog() {
  const { opened, mode, eventId, instanceStart, pendingUpdate } =
    useRecurringEventDialogData();
  const { close: closeConfirm, confirm: confirmDialog } =
    useManageRecurringEventDialog();
  const closeEventDialog = useCalendarEventDialogStore((s) => s.close);

  const cancelOccurrence = useCancelOccurrenceMutation();
  const deleteEvent = useDeleteCalendarEventMutation();
  const detachInstance = useDetachInstanceMutation();
  const splitSeries = useSplitSeriesMutation();

  const handleClose = () => {
    closeConfirm();
  };

  const handleThisOnly = () => {
    const start = toISOStringWithTimezone(instanceStart!);

    if (mode === "delete") {
      cancelOccurrence.mutate({
        eventId,
        occurrenceStart: start,
        instanceId: `${eventId}::${start}`,
      });
    } else {
      detachInstance.mutate({
        eventId,
        instanceStart: start,
        dto: pendingUpdate ?? {},
      });
    }
    confirmDialog();
    closeEventDialog();
  };

  const handleAllOrFuture = () => {
    const start = toISOStringWithTimezone(instanceStart!);

    if (mode === "delete") {
      deleteEvent.mutate(eventId);
    } else {
      splitSeries.mutate({
        eventId,
        splitStart: start,
        dto: pendingUpdate ?? {},
      });
    }
    confirmDialog();
    closeEventDialog();
  };

  const title =
    mode === "delete" ? "Delete recurring event" : "Edit recurring event";

  const description =
    mode === "delete"
      ? "This is a recurring event. What would you like to delete?"
      : "This is a recurring event. What would you like to change?";

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={title}
      size="sm"
      centered
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {description}
        </Text>
        <Stack gap="xs">
          <Button variant="default" fullWidth onClick={handleThisOnly}>
            Only this event
          </Button>
          <Button variant="default" fullWidth onClick={handleAllOrFuture}>
            {mode === "delete"
              ? "All events in series"
              : "This and future events"}
          </Button>
        </Stack>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={handleClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
