export function messageRepliesQueryKey(threadId: string, messageId: string) {
  return [
    "messages",
    "threads",
    threadId,
    "messages",
    messageId,
    "replies",
  ] as const;
}

export const useMessageRepliesQueryData = (
  threadId: string,
  messageId: string,
) => {
  return { queryKey: messageRepliesQueryKey(threadId, messageId) };
};
