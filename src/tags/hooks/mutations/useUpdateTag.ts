import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { updateTag } from "@/tags/apis/updateTag";
import type { TagDto, TagUpdateInput } from "@/tags/models/tag";
import { merge } from "lodash";
import { useFilteredTagsQueryData } from "../queries/useFilteredTagsQueryData";

export function useUpdateTagMutation() {
  const { queryKey } = useFilteredTagsQueryData();
  return useOptimisticMutation<TagDto[], TagUpdateInput>({
    queryKey,
    mutationFn: updateTag,
    updater: updateOptimisticTag,
    skipInvalidateOnSuccess: true,
  });
}
function updateOptimisticTag(
  previous: TagDto[] | undefined,
  input: TagUpdateInput,
): TagDto[] {
  if (!previous) return [];

  return previous.map((tag) =>
    tag.id === input.id ? merge({}, tag, input) : tag,
  );
}
