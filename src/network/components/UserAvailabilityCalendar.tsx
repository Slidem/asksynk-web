import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/react";
import { Button, Group, SegmentedControl } from "@mantine/core";
import { useRef, useState } from "react";
import type { DatesSetArg } from "@fullcalendar/core";

import { useUserCalendarEvents } from "@/schedule/hooks/queries/useUserCalendarEvents";
import calendarClasses from "@/schedule/components/ScheduleCalendar.module.css";

interface Props {
  userId: string;
}

const VIEW_OPTIONS = [
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
];

export function UserAvailabilityCalendar({ userId }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  const [range, setRange] = useState<{ start: Date; end: Date } | null>(null);
  const [view, setView] = useState("timeGridWeek");

  const { data: events } = useUserCalendarEvents(userId, range);

  const handleDatesSet = (arg: DatesSetArg) => {
    setRange({ start: arg.start, end: arg.end });
  };

  const handleViewChange = (value: string) => {
    setView(value);
    calendarRef.current?.getApi().changeView(value);
  };

  return (
    <div
      className={calendarClasses.wrapper}
      style={{ display: "flex", flexDirection: "column", height: 520 }}
    >
      <Group justify="space-between" mb="sm">
        <Button
          variant="default"
          size="compact-sm"
          onClick={() => calendarRef.current?.getApi().today()}
        >
          Today
        </Button>
        <SegmentedControl
          size="xs"
          data={VIEW_OPTIONS}
          value={view}
          onChange={handleViewChange}
        />
      </Group>
      <div style={{ flex: 1, minHeight: 0 }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={false}
          events={events ?? []}
          editable={false}
          selectable={false}
          dayMaxEvents
          slotLabelFormat={{ hour: "numeric", meridiem: "short" }}
          nowIndicator
          datesSet={handleDatesSet}
          height="100%"
        />
      </div>
    </div>
  );
}
