import { fetchFilteredTags } from "@/tags/apis/fetchFilteredTags";
import type { TagDto } from "@/tags/models/tag";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches a user's full tag list (caller's tags when userId is omitted).
 * Backend gates non-self access by network connection.
 */
export function useUserTags<T = TagDto[]>(
  userId?: string,
  selectFn?: (data: TagDto[]) => T,
) {
  return useQuery({
    queryKey: ["tags", { userId, answerMode: "all" }] as const,
    queryFn: () => fetchFilteredTags({ userId, answerMode: "all" }),
    placeholderData: [],
    select: selectFn,
  });
}
