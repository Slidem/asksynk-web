import type FullCalendar from "@fullcalendar/react";
import { ActionIcon, Button, Group, Select, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { RefObject } from "react";

import {
  usePublicScheduleView,
  usePublicScheduleViewHandlers,
} from "@/public-schedule/hooks/usePublicScheduleView";

const VIEW_OPTIONS = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
];

interface Props {
  calendarRef: RefObject<FullCalendar | null>;
}

export function PublicScheduleToolbar({ calendarRef }: Props) {
  const { calendarTitle, currentView } = usePublicScheduleView();
  const { setView } = usePublicScheduleViewHandlers();
  const getApi = () => calendarRef.current?.getApi() ?? null;

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

      <Select
        data={VIEW_OPTIONS}
        value={currentView}
        onChange={(value) => {
          if (!value) return;
          getApi()?.changeView(value);
          setView(value);
        }}
        size="xs"
        w={110}
        allowDeselect={false}
      />
    </Group>
  );
}
