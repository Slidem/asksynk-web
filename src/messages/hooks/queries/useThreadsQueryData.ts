export function threadsQueryKey() {
  return ["messages", "threads"] as const;
}

export const useThreadsQueryData = () => {
  return { queryKey: threadsQueryKey() };
};
