import { fetchTaskBatch } from "@/tasks/apis/fetchTaskBatch";
import { getTaskBatchQueryKey } from "@/tasks/hooks/queries/useTaskBatchQueryData";
import type { TaskBatch } from "@/tasks/models/taskBatch";
import { useQueries } from "@tanstack/react-query";

// There is no batch list endpoint; the board fetches each distinct batch by id.
// Keys match useTaskBatch so the detail dialog reuses the same cache entries.
export function useTaskBatches(batchIds: string[]): Map<string, TaskBatch> {
  const results = useQueries({
    queries: batchIds.map((id) => ({
      queryKey: getTaskBatchQueryKey(id),
      queryFn: () => fetchTaskBatch(id),
    })),
    combine: (queryResults) => {
      const byId = new Map<string, TaskBatch>();
      for (const result of queryResults) {
        if (result.data) {
          byId.set(result.data.id, result.data);
        }
      }
      return byId;
    },
  });

  return results;
}
