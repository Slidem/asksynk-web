import { createUuidV7 } from "@/lib/id";
import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { createTag } from "@/tags/apis/createTag";
import type { TagsFilters } from "@/tags/models/filters";
import type { TagCreateInput, TagDto } from "@/tags/models/tag";
import { randomColor } from "@/tags/utils/tagRandomColors";

type TagsQueryKey = ["tags"] | ["tags", TagsFilters];

export const useCreateQuickTag = (queryKey: TagsQueryKey) => {
  const mutationObj = useOptimisticMutation<TagDto[], TagCreateInput>({
    queryKey,
    mutationFn: createTag,
    updater: (previous, input) => {
      const nextTag: TagDto = {
        id: input.id.toString(),
        name: input.name,
        color: input.color,
        description: input.description,
        answerMode: input.answerMode,
        notificationsSettings: input.notificationsSettings,
      };

      return [...(previous ?? []), nextTag];
    },
    skipInvalidateOnSuccess: true,
  });

  const quickCreateTag = (tagName: string) => {
    if (!tagName.trim()) {
      return null;
    }

    const id = createUuidV7();
    mutationObj.mutate({
      id,
      name: tagName,
      color: randomColor(),
      answerMode: { type: "timeblock" },
      notificationsSettings: {
        browserNotificationEnabled: true,
        soundNotificationEnabled: true,
      },
    });
    return id;
  };
  return { quickCreateTag, isCreating: mutationObj.isPending };
};
