import { Button, Group, Modal, Stack, Text } from "@mantine/core";

import { useRecurringConfirmDialogStore } from "@/schedule/store/recurringConfirmDialogStore";
import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";
import {
  useCancelOccurrenceMutation,
  useDeleteCalendarEventMutation,
  useDetachInstanceMutation,
  useSplitSeriesMutation,
} from "@/schedule/hooks/mutations";

export function RecurringEventConfirmDialog() {
  const opened = useRecurringConfirmDialogStore((s) => s.opened);
  const mode = useRecurringConfirmDialogStore((s) => s.mode);
  const eventId = useRecurringConfirmDialogStore((s) => s.eventId);
  const instanceStart = useRecurringConfirmDialogStore((s) => s.instanceStart);
  const pendingUpdate = useRecurringConfirmDialogStore((s) => s.pendingUpdate);
  const closeConfirm = useRecurringConfirmDialogStore((s) => s.close);
  const closeEventDialog = useCalendarEventDialogStore((s) => s.close);

  const cancelOccurrence = useCancelOccurrenceMutation();
  const deleteEvent = useDeleteCalendarEventMutation();
  const detachInstance = useDetachInstanceMutation();
  const splitSeries = useSplitSeriesMutation();

  const handleClose = () => {
    closeConfirm();
  };

  const handleThisOnly = () => {
    if (mode === "delete") {
      cancelOccurrence.mutate({
        eventId,
        occurrenceStart: instanceStart,
        instanceId: `${eventId}::${instanceStart}`,
      });
    } else {
      detachInstance.mutate({
        eventId,
        instanceStart,
        dto: pendingUpdate ?? {},
      });
    }
    closeConfirm();
    closeEventDialog();
  };

  const handleAllOrFuture = () => {
    if (mode === "delete") {
      deleteEvent.mutate(eventId);
    } else {
      splitSeries.mutate({
        eventId,
        splitStart: instanceStart,
        dto: pendingUpdate ?? {},
      });
    }
    closeConfirm();
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
