import { fetchFilteredTags } from "@/tags/apis/fetchFilteredTags";
import type { TagDto } from "@/tags/models/tag";
import { useQuery } from "@tanstack/react-query";
import { useFilteredTagsQueryData } from "./useFilteredTagsQueryData";

export function useFilteredTags<T = TagDto[]>(
  selectFn?: (data: TagDto[]) => T,
) {
  const { filters, queryKey } = useFilteredTagsQueryData();
  return useQuery({
    queryKey,
    queryFn: () => fetchFilteredTags(filters),
    placeholderData: [],
    select: selectFn ?? undefined,
  });
}
