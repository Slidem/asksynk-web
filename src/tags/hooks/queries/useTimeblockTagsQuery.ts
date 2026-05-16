import { useQuery } from "@tanstack/react-query";

import { fetchFilteredTags } from "@/tags/apis/fetchFilteredTags";
import type { TagDto } from "@/tags/models/tag";
import { getFilteredTagsQueryKey } from "./useFilteredTagsQueryData";

export function useTimeblockTagsQuery(userId?: string | null): TagDto[] {
  const filters = { answerMode: "timeblock" as const, userId: userId ?? undefined };
  const { data } = useQuery({
    queryKey: getFilteredTagsQueryKey(filters),
    queryFn: () => fetchFilteredTags(filters),
    placeholderData: (prev) => prev ?? [],
  });
  return data ?? [];
}
