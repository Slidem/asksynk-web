import { Container, Stack, Tabs } from "@mantine/core";
import { getRouteApi } from "@tanstack/react-router";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { QuickSuggestRow } from "@/tasks/components/QuickSuggestRow";
import { SuggestionsList } from "@/tasks/components/SuggestionsList";
import { TaskBatchCreateDialog } from "@/tasks/components/TaskBatchCreateDialog";
import { TaskBatchDetailDialog } from "@/tasks/components/TaskBatchDetailDialog";
import { TaskBoard } from "@/tasks/components/TaskBoard";
import { TaskCreateDialog } from "@/tasks/components/TaskCreateDialog";
import { TaskEditDialog } from "@/tasks/components/TaskEditDialog";
import { TaskSuggestionCreateDialog } from "@/tasks/components/TaskSuggestionCreateDialog";
import { TaskSuggestionEditDialog } from "@/tasks/components/TaskSuggestionEditDialog";
import { TasksPageHeader } from "@/tasks/components/TasksPageHeader";
import type { TasksTab } from "@/tasks/models/tasksTab";

const routeApi = getRouteApi("/_authenticated/tasks");

export function TasksPage() {
  const { tab, focusTaskId, focusBatchId, focusSuggestionId } =
    routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const isMobile = useIsMobile();

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    // Switching tabs drops focus params from deep links.
    navigate({ search: { tab: value as TasksTab } });
  };

  return (
    <Container size="xl" maw={1200} w="100%" py="lg">
      <Stack gap="lg">
        <TasksPageHeader />

        <Tabs value={tab} onChange={handleTabChange}>
          <Tabs.List grow={isMobile}>
            <Tabs.Tab value="my-tasks">
              {isMobile ? "Mine" : "My Tasks"}
            </Tabs.Tab>
            <Tabs.Tab value="suggested-to-me">
              {isMobile ? "To me" : "Suggested to me"}
            </Tabs.Tab>
            <Tabs.Tab value="suggested-by-me">
              {isMobile ? "By me" : "Suggested by me"}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="my-tasks" pt="md">
            <TaskBoard
              focusTaskId={focusTaskId}
              focusBatchId={focusBatchId}
            />
          </Tabs.Panel>
          <Tabs.Panel value="suggested-to-me" pt="md">
            <SuggestionsList
              role="received"
              focusSuggestionId={focusSuggestionId}
            />
          </Tabs.Panel>
          <Tabs.Panel value="suggested-by-me" pt="md">
            <Stack gap="md">
              <QuickSuggestRow />
              <SuggestionsList
                role="sent"
                focusSuggestionId={focusSuggestionId}
              />
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      <TaskCreateDialog />
      <TaskEditDialog />
      <TaskBatchCreateDialog />
      <TaskBatchDetailDialog />
      <TaskSuggestionCreateDialog />
      <TaskSuggestionEditDialog />
    </Container>
  );
}
