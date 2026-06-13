import { fetchTaskBatch } from "@/tasks/apis/fetchTaskBatch";
import { getTaskBatchQueryKey } from "@/tasks/hooks/queries/useTaskBatchQueryData";
import { useQuery } from "@tanstack/react-query";

export function useTaskBatch(
  id: string | undefined,
  opts?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: getTaskBatchQueryKey(id ?? ""),
    queryFn: () => fetchTaskBatch(id as string),
    enabled: Boolean(id) && (opts?.enabled ?? true),
  });
}
