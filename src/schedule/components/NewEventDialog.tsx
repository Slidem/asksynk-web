import { Button, Group, Modal, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import { createUuidV7 } from "@/lib/id";
import { useNewEventDialogStore } from "@/schedule/store/newEventDialogStore";
import { useScheduleStore } from "@/schedule/store/scheduleStore";
import { shallow } from "zustand/shallow";

type EventFormValues = {
  title: string;
  start: Date | null;
  end: Date | null;
};

export function NewEventDialog() {
  const opened = useNewEventDialogStore((s) => s.opened);
  const closeDialog = useNewEventDialogStore((s) => s.close);
  const addEvent = useScheduleStore((s) => s.addEvent);

  const form = useForm<EventFormValues>({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      start: null,
      end: null,
    },
  });

  useEffect(() => {
    const unsubscribe = useNewEventDialogStore.subscribe(
      (state) => ({
        opened: state.opened,
        start: state.start,
        end: state.end,
      }),
      (state, prevState) => {
        if (!prevState.opened && state.opened && state.start && state.end) {
          form.setValues({ start: state.start, end: state.end });
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

  const handleCreate = () => {
    const values = form.getValues();
    if (!values.title.trim() || !values.start || !values.end) return;

    addEvent({
      id: createUuidV7().toString(),
      title: values.title,
      start: values.start.toISOString(),
      end: values.end.toISOString(),
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
        <Button onClick={handleCreate}>Create event</Button>
      </Group>
    </Modal>
  );
}
