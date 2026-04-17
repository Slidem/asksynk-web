import {
  Button,
  Checkbox,
  ColorInput,
  Group,
  Modal,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import { createUuidV7 } from "@/lib/id";
import { useCreateCalendarEvent } from "@/schedule/hooks/mutations/useCreateCalendarEvent";
import { useDeleteCalendarEvent } from "@/schedule/hooks/mutations/useDeleteCalendarEvent";
import { useUpdateCalendarEvent } from "@/schedule/hooks/mutations/useUpdateCalendarEvent";
import { useCalendarEventDetail } from "@/schedule/hooks/queries/useCalendarEventDetail";
import {
  DEFAULT_FORM_VALUES,
  RECURRENCE_OPTIONS,
  type CalendarEventFormValues,
} from "@/schedule/models/calendarEventForm";
import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";
import {
  formToCreateInput,
  formToUpdateInput,
  rruleToRecurrence,
} from "@/schedule/utils/calendarEventMapper";
import { TagSelector } from "../../tags/components/TagSelector";
import {
  useCloseEventDialog,
  useEventDialogData,
} from "@/schedule/hooks/dialogs/calendarEventDialogHooks";
import { useManageRecurringEventDialog } from "@/schedule/hooks/dialogs/recurringEventDialogHooks";

export function CalendarEventDialog() {
  const { opened, mode, openedEvent } = useEventDialogData();
  const closeDialog = useCloseEventDialog();
  const { open: openRecurringConfirm } = useManageRecurringEventDialog();
  const createMutation = useCreateCalendarEvent();
  const updateMutation = useUpdateCalendarEvent();
  const deleteMutation = useDeleteCalendarEvent();

  // Fetch full event details for edit mode to get isRecurring
  const editEventId =
    mode === "edit" && openedEvent ? openedEvent.eventId : null;
  const { data: eventDetail } = useCalendarEventDetail(editEventId);

  const form = useForm<CalendarEventFormValues>({
    mode: "uncontrolled",
    initialValues: DEFAULT_FORM_VALUES,
  });

  const [showRecurrence, setShowRecurrence] = useState(false);
  form.watch("recurrence", ({ value }) => {
    setShowRecurrence(!!value);
  });

  const [currentTagIds, setCurrentTagIds] = useState<string[]>([]);
  form.watch("tagIds", ({ value }) => {
    setCurrentTagIds(value);
  });

  useEffect(() => {
    const unsubscribe = useCalendarEventDialogStore.subscribe(
      (state) => ({
        opened: state.opened,
        openedEvent: state.openedEvent,
        mode: state.mode,
      }),
      (state, prevState) => {
        if (prevState.opened || !state.opened || !state.openedEvent) {
          return;
        }

        if (state.mode === "edit") {
          form.setValues({
            title: state.openedEvent.title || "",
            description: state.openedEvent.description ?? "",
            location: state.openedEvent.location ?? "",
            link: state.openedEvent.link ?? "",
            color: state.openedEvent.color ?? "#4285f4",
            start: state.openedEvent.start,
            end: state.openedEvent.end,
            tagIds: state.openedEvent.tagIds ?? [],
            recurrence: state.openedEvent.rrule
              ? rruleToRecurrence(state.openedEvent.rrule)
              : "",
          });
        } else {
          form.setValues({
            ...DEFAULT_FORM_VALUES,
            start: state.openedEvent.start,
            end: state.openedEvent.end,
          });
        }
      },
      { equalityFn: shallow },
    );
    return () => unsubscribe();
  }, [form]);

  const handleClose = () => {
    form.reset();
    closeDialog();
  };

  const handleAction = async () => {
    const values = form.getValues();
    if (!values.title.trim() || !values.start || !values.end) return;

    if (mode === "create") {
      const id = createUuidV7();
      const input = formToCreateInput(values, id.toString());
      await createMutation.mutateAsync(input);
      handleClose();
    } else if (openedEvent) {
      const update = formToUpdateInput(values);

      if (eventDetail?.rrule && openedEvent.instanceStart) {
        openRecurringConfirm({
          mode: "edit",
          eventId: openedEvent.eventId,
          instanceStart: openedEvent.instanceStart,
          pendingUpdate: update,
        });
      } else {
        updateMutation.mutate({
          eventId: openedEvent.eventId,
          update,
        });
        handleClose();
      }
    }
  };

  const handleDelete = () => {
    if (!openedEvent) return;

    if (eventDetail?.rrule && openedEvent.instanceStart) {
      openRecurringConfirm({
        mode: "delete",
        eventId: openedEvent.eventId,
        instanceStart: openedEvent.instanceStart,
      });
    } else {
      deleteMutation.mutate(openedEvent.eventId);
      handleClose();
    }
  };

  const title = mode === "create" ? "New event" : "Edit event";
  const actionText = mode === "create" ? "Create" : "Update";

  return (
    <Modal opened={opened} onClose={handleClose} title={title} size="md">
      <TextInput
        label="Title"
        placeholder="Event title"
        key={form.key("title")}
        {...form.getInputProps("title")}
        mb="sm"
      />
      <Textarea
        label="Description"
        placeholder="Add a description..."
        key={form.key("description")}
        {...form.getInputProps("description")}
        mb="sm"
        autosize
        minRows={2}
        maxRows={4}
      />
      <Group grow mb="sm">
        <TextInput
          label="Location"
          placeholder="Add location"
          key={form.key("location")}
          {...form.getInputProps("location")}
        />
        <TextInput
          label="Link"
          placeholder="Add link"
          key={form.key("link")}
          {...form.getInputProps("link")}
        />
        <ColorInput
          label="Color"
          key={form.key("color")}
          {...form.getInputProps("color")}
        />
      </Group>
      <Group grow mb="sm">
        <DateTimePicker
          label="Start"
          key={form.key("start")}
          {...form.getInputProps("start")}
        />
        <DateTimePicker
          label="End"
          key={form.key("end")}
          {...form.getInputProps("end")}
        />
      </Group>

      <Group mb="sm" gap="md">
        <Checkbox
          label="Recurring event"
          checked={showRecurrence}
          onChange={(e) => {
            form.setFieldValue(
              "recurrence",
              e.currentTarget.checked ? "WEEKLY" : "",
            );
          }}
        />
        {showRecurrence && (
          <Select
            data={RECURRENCE_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            key={form.key("recurrence")}
            {...form.getInputProps("recurrence")}
            allowDeselect={false}
            size="xs"
            w={120}
          />
        )}
      </Group>

      <TagSelector
        selectedTagIds={currentTagIds}
        onChange={(tagIds) => form.setFieldValue("tagIds", tagIds)}
      />

      <Group justify="space-between" mt="md">
        <div>
          {mode === "edit" && (
            <Button
              variant="subtle"
              color="red"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          )}
        </div>
        <Group gap="xs">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAction} loading={createMutation.isPending}>
            {actionText}
          </Button>
        </Group>
      </Group>
    </Modal>
  );
}
