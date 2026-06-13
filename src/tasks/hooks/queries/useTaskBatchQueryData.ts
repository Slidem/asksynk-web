export function getTaskBatchQueryKey(id: string) {
  return ["task-batches", id] as const;
}
