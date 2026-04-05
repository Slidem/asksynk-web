import { Container, Paper, Stack } from "@mantine/core";

import { SchedulePageHeader } from "./SchedulePageHeader";
import { CalendarUserRow } from "./CalendarUserRow";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { NewEventDialog } from "./NewEventDialog";

export function SchedulePage() {
  return (
    <Container
      size="xl"
      w="100%"
      py="lg"
      style={{
        height: "calc(100vh - 2 * var(--mantine-spacing-md))",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack gap="lg" style={{ flex: 1, minHeight: 0 }}>
        <SchedulePageHeader />
        <Paper
          withBorder
          radius="lg"
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <CalendarUserRow />
          <ScheduleCalendar />
        </Paper>
      </Stack>

      <NewEventDialog />
    </Container>
  );
}
