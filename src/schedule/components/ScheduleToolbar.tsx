import type FullCalendar from "@fullcalendar/react";
import { ActionIcon, Button, Group, Select, Text } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";
import type { RefObject } from "react";

import { useScheduleStore } from "@/schedule/store/scheduleStore";
import { useOpenNewEventDialog } from "../hooks/useOpenNewEventDialog";

const VIEW_OPTIONS = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
];

type ScheduleToolbarProps = {
  calendarRef: RefObject<FullCalendar | null>;
};

export function ScheduleToolbar({ calendarRef }: ScheduleToolbarProps) {
  const title = useScheduleStore((s) => s.calendarTitle);
  const currentView = useScheduleStore((s) => s.currentView);
  const setView = useScheduleStore((s) => s.setView);
  const openNewEventDialog = useOpenNewEventDialog();
  const getApi = () => calendarRef.current?.getApi() ?? null;

  const handleToday = () => getApi()?.today();
  const handlePrev = () => getApi()?.prev();
  const handleNext = () => getApi()?.next();

  const handleViewChange = (value: string | null) => {
    if (!value) return;
    getApi()?.changeView(value);
    setView(value);
  };

  const handleNewEvent = () => {
    const now = new Date();
    const end = new Date(now.getTime() + 60 * 60 * 1000);
    openNewEventDialog(now, end);
  };

  return (
    <Group justify="space-between" mb="md">
      <Group gap="sm">
        <Button variant="default" size="compact-sm" onClick={handleToday}>
          Today
        </Button>
        <ActionIcon variant="subtle" size="sm" onClick={handlePrev}>
          <IconChevronLeft size={16} />
        </ActionIcon>
        <ActionIcon variant="subtle" size="sm" onClick={handleNext}>
          <IconChevronRight size={16} />
        </ActionIcon>
        <Text fw={500} size="lg">
          {title}
        </Text>
      </Group>

      <Group gap="sm">
        <Select
          data={VIEW_OPTIONS}
          value={currentView}
          onChange={handleViewChange}
          size="xs"
          w={110}
          allowDeselect={false}
        />
        <Button
          size="compact-sm"
          leftSection={<IconPlus size={14} />}
          onClick={handleNewEvent}
        >
          New event
        </Button>
      </Group>
    </Group>
  );
}
