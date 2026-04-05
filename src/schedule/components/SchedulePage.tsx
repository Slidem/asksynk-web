import { Container, Stack } from "@mantine/core";

import { SchedulePageHeader } from "./SchedulePageHeader";
import { CalendarUserRow } from "./CalendarUserRow";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { NewEventDialog } from "./NewEventDialog";

export function SchedulePage() {
  return (
    <Container size="xl" w="100%" py="lg">
      <Stack gap="lg">
        <SchedulePageHeader />
        <CalendarUserRow />
        <ScheduleCalendar />
      </Stack>

      <NewEventDialog />
    </Container>
  );
}
