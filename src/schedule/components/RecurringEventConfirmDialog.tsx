import { Button, Group, Modal, Stack, Text } from "@mantine/core";

import { useCancelOccurrence } from "@/schedule/hooks/mutations/useCancelOccurrence";
import { useDeleteCalendarEvent } from "@/schedule/hooks/mutations/useDeleteCalendarEvent";
import { useDetachInstance } from "@/schedule/hooks/mutations/useDetachInstance";
import { useSplitSeries } from "@/schedule/hooks/mutations/useSplitSeries";
import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";
import {
  useManageRecurringEventDialog,
  useRecurringEventDialogData,
} from "@/schedule/hooks/dialogs/recurringEventDialogHooks";
import { toISOStringWithTimezone } from "@/lib/date";

export function RecurringEventConfirmDialog() {
  const { opened, mode, eventId, instanceStart, pendingUpdate } =
    useRecurringEventDialogData();
  const { close: closeConfirm, confirm: confirmDialog } =
    useManageRecurringEventDialog();
  const closeEventDialog = useCalendarEventDialogStore((s) => s.close);

  const cancelOccurrence = useCancelOccurrence();
  const deleteEvent = useDeleteCalendarEvent();
  const detachInstance = useDetachInstance();
  const splitSeries = useSplitSeries();

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
