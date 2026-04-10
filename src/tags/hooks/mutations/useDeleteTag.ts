import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { deleteTag } from "@/tags/apis/deleteTag";
import type { TagDto } from "@/tags/models/tag";
import { useFilteredTagsQueryData } from "../queries/useFilteredTagsQueryData";

export function useDeleteTagMutation() {
  const { queryKey } = useFilteredTagsQueryData();
  return useOptimisticMutation<TagDto[], string>({
    queryKey,
    mutationFn: deleteTag,
    updater: removeOptimisticTag,
    skipInvalidateOnSuccess: true,
  });
}
function removeOptimisticTag(
  previous: TagDto[] | undefined,
  tagId: string,
): TagDto[] {
  if (!previous) return [];

  return previous.filter((tag) => tag.id !== tagId);
}
