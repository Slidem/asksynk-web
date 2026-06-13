import { Stack } from "@mantine/core";
import { useMemo } from "react";

import { SuggestionStatusGroup } from "@/tasks/components/SuggestionStatusGroup";
import { TasksEmptyState } from "@/tasks/components/TasksEmptyState";
import { useFocusFlash } from "@/tasks/hooks/useFocusFlash";
import { useTaskSuggestions } from "@/tasks/hooks/queries/useTaskSuggestions";
import type {
  SuggestionRole,
  SuggestionStatus,
  TaskSuggestion,
} from "@/tasks/models/taskSuggestion";

const GROUPS: { status: SuggestionStatus; title: string }[] = [
  { status: "pending", title: "Pending" },
  { status: "accepted", title: "Accepted" },
  { status: "rejected", title: "Rejected" },
];

const EMPTY_MESSAGE: Record<SuggestionRole, string> = {
  sent: "You haven't suggested any tasks yet",
  received: "No one has suggested tasks to you yet",
};

interface Props {
  role: SuggestionRole;
  focusSuggestionId?: string;
}

export function SuggestionsList({ role, focusSuggestionId }: Props) {
  const { data: suggestions = [] } = useTaskSuggestions(role);
  const { registerNode, highlightedId } = useFocusFlash(
    focusSuggestionId,
    suggestions,
  );

  const byStatus = useMemo(() => {
    const map: Record<SuggestionStatus, TaskSuggestion[]> = {
      pending: [],
      accepted: [],
      rejected: [],
    };
    for (const suggestion of suggestions) {
      map[suggestion.status].push(suggestion);
    }
    return map;
  }, [suggestions]);

  if (suggestions.length === 0) {
    return <TasksEmptyState message={EMPTY_MESSAGE[role]} />;
  }

  return (
    <Stack gap="lg">
      {GROUPS.map((group) => (
        <SuggestionStatusGroup
          key={group.status}
          title={group.title}
          suggestions={byStatus[group.status]}
          role={role}
          registerNode={registerNode}
          highlightedId={highlightedId}
        />
      ))}
    </Stack>
  );
}
