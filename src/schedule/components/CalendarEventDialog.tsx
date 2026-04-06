import { Button, Group, Modal, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import { useCalendarEventDialogStore } from "@/schedule/store/calendarEventDialogStore";
import { shallow } from "zustand/shallow";

type EventFormValues = {
  title: string;
  start: Date | null;
  end: Date | null;
};

export function CalendarEventDialog() {
  const eventId = useCalendarEventDialogStore((s) => s.openedEvent?.id || "");
  const opened = useCalendarEventDialogStore((s) => s.opened);
  const closeDialog = useCalendarEventDialogStore((s) => s.close);
  const actionText = useCalendarEventDialogStore((s) => s.actionText);
  const onAction = useCalendarEventDialogStore((s) => s.onAction);
  const form = useForm<EventFormValues>({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      start: null,
      end: null,
    },
  });

  useEffect(() => {
    const unsubscribe = useCalendarEventDialogStore.subscribe(
      (state) => ({
        opened: state.opened,
        openedEvent: state.openedEvent,
      }),
      (state, prevState) => {
        if (!prevState.opened && state.opened && state.openedEvent) {
          form.setValues({
            title: state.openedEvent.title || "",
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

  const handleAction = () => {
    const values = form.getValues();
    if (!values.title.trim() || !values.start || !values.end) return;

    onAction({
      id: eventId,
      title: values.title,
      start: values.start,
      end: values.end,
    });

    handleClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="New event" size="md">
      <TextInput
        label="Title"
        placeholder="Event title"
        key={form.key("title")}
        {...form.getInputProps("title")}
        mb="sm"
      />
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

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleAction}>{actionText}</Button>
      </Group>
    </Modal>
  );
}
