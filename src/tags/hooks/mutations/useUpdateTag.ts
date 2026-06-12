import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { requestNotificationPermission } from "@/lib/browserNotification";
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
    onSuccess: (_data, input) => {
      // Save is a user gesture — good moment to ask for desktop alerts.
      if (input.notificationsSettings?.browserNotificationEnabled) {
        void requestNotificationPermission();
      }
    },
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
