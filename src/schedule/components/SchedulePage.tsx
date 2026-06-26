import { Container, Paper, Stack } from "@mantine/core";

import { useEnsureCalendar } from "@/schedule/hooks/queries/useEnsureCalendar";
import { useSyncSelectedUserFromUrl } from "@/schedule/hooks/useSyncSelectedUserFromUrl";
import { SchedulePageHeader } from "./SchedulePageHeader";
import { CalendarUserRow } from "./CalendarUserRow";
import { CalendarSyncErrorBanner } from "./CalendarSyncErrorBanner";
import { CalendarIntegrationsLegend } from "./CalendarIntegrationsLegend";
import { ScheduleCalendar } from "./ScheduleCalendar";
import { CalendarEventDialog } from "./CalendarEventDialog";
import { RecurringEventConfirmDialog } from "./RecurringEventConfirmDialog";

export function SchedulePage() {
  useEnsureCalendar();
  useSyncSelectedUserFromUrl();

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
          <CalendarSyncErrorBanner />
          <CalendarIntegrationsLegend />
          <ScheduleCalendar />
        </Paper>
      </Stack>

      <CalendarEventDialog />
      <RecurringEventConfirmDialog />
    </Container>
  );
}
