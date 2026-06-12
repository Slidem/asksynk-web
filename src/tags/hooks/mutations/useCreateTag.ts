import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { requestNotificationPermission } from "@/lib/browserNotification";
import { createTag } from "@/tags/apis/createTag";
import type { TagDto, TagCreateInput } from "@/tags/models/tag";
import { useFilteredTagsQueryData } from "../queries/useFilteredTagsQueryData";

export function useCreateTag() {
  const { queryKey } = useFilteredTagsQueryData();
  const mutationObj = useOptimisticMutation<TagDto[], TagCreateInput>({
    queryKey,
    mutationFn: createTag,
    updater: (previous, input) => {
      const nextTag: TagDto = {
        id: input.id.toString(),
        name: input.name,
        description: input.description,
        color: input.color,
        answerMode: input.answerMode,
        notificationsSettings: input.notificationsSettings,
      };

      return [...(previous ?? []), nextTag];
    },
    skipInvalidateOnSuccess: true,
    onSuccess: (_data, input) => {
      // Save is a user gesture — good moment to ask for desktop alerts.
      if (input.notificationsSettings.browserNotificationEnabled) {
        void requestNotificationPermission();
      }
    },
  });

  return { createTag: mutationObj.mutate, isCreating: mutationObj.isPending };
}
