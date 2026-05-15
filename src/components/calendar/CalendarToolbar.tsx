import type FullCalendar from "@fullcalendar/react";
import { ActionIcon, Button, Group, Select, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { ReactNode, RefObject } from "react";

const DEFAULT_VIEW_OPTIONS = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
];

interface Props {
  calendarRef: RefObject<FullCalendar | null>;
  calendarTitle: string;
  currentView: string;
  onViewChange: (view: string) => void;
  rightSection?: ReactNode;
  viewOptions?: { value: string; label: string }[];
}

export function CalendarToolbar({
  calendarRef,
  calendarTitle,
  currentView,
  onViewChange,
  rightSection,
  viewOptions,
}: Props) {
  const getApi = () => calendarRef.current?.getApi() ?? null;

  const handleViewChange = (value: string | null) => {
    if (!value) return;
    getApi()?.changeView(value);
    onViewChange(value);
  };

  return (
    <Group justify="space-between" mb="md">
      <Group gap="sm">
        <Button
          variant="default"
          size="compact-sm"
          onClick={() => getApi()?.today()}
        >
          Today
        </Button>
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={() => getApi()?.prev()}
          aria-label="Previous"
        >
          <IconChevronLeft size={16} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={() => getApi()?.next()}
          aria-label="Next"
        >
          <IconChevronRight size={16} />
        </ActionIcon>
        <Text fw={500} size="lg">
          {calendarTitle}
        </Text>
      </Group>

      <Group gap="sm">
        <Select
          data={viewOptions ?? DEFAULT_VIEW_OPTIONS}
          value={currentView}
          onChange={handleViewChange}
          size="xs"
          w={110}
          allowDeselect={false}
        />
        {rightSection}
      </Group>
    </Group>
  );
}
