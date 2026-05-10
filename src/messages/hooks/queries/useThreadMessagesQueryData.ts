export function threadMessagesQueryKey(threadId: string) {
  return ["messages", "threads", threadId, "messages"] as const;
}

export const useThreadMessagesQueryData = (threadId: string) => {
  return { queryKey: threadMessagesQueryKey(threadId) };
};
