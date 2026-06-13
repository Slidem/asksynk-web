import { Divider, Paper, Stack, Text } from "@mantine/core";
import { Fragment } from "react";

import { SuggestionRow } from "@/tasks/components/SuggestionRow";
import type {
  SuggestionRole,
  TaskSuggestion,
} from "@/tasks/models/taskSuggestion";

interface Props {
  title: string;
  suggestions: TaskSuggestion[];
  role: SuggestionRole;
  registerNode?: (id: string) => (el: HTMLElement | null) => void;
  highlightedId?: string | null;
}

export function SuggestionStatusGroup({
  title,
  suggestions,
  role,
  registerNode,
  highlightedId,
}: Props) {
  if (suggestions.length === 0) return null;

  return (
    <Stack gap="xs">
      <Text size="sm" fw={600} c="dimmed">
        {title}
      </Text>
      <Paper withBorder radius="md">
        {suggestions.map((suggestion, index) => (
          <Fragment key={suggestion.id}>
            {index > 0 && <Divider />}
            <SuggestionRow
              suggestion={suggestion}
              role={role}
              flashRef={registerNode?.(suggestion.id)}
              highlighted={highlightedId === suggestion.id}
            />
          </Fragment>
        ))}
      </Paper>
    </Stack>
  );
}
