import type { TagCreateInput, TagDto, TagUpdateInput } from "@/tags/models/tag";
import { apiFetch, buildApiUrl } from "@/lib/api";

import { merge } from "lodash";
import { useFilteredTagsQueryData } from "@/tags/hooks/queries";
import { useOptimisticMutation } from "@/lib/useOptimisticMutation";

function updateOptimisticTag(
  previous: TagDto[] | undefined,
  input: TagUpdateInput,
): TagDto[] {
  if (!previous) return [];

  return previous.map((tag) =>
    tag.id === input.id ? merge({}, tag, input) : tag,
  );
}

function removeOptimisticTag(
  previous: TagDto[] | undefined,
  tagId: string,
): TagDto[] {
  if (!previous) return [];

  return previous.filter((tag) => tag.id !== tagId);
}

async function createTag(input: TagCreateInput) {
  const response = await apiFetch(buildApiUrl("/tags"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create tag");
  }

  return response.json() as Promise<TagDto>;
}

async function updateTag(input: TagUpdateInput) {
  const response = await apiFetch(buildApiUrl(`/tags/${input.id}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      description: input.description,
      color: input.color,
      answerMode: input.answerMode,
      notificationsSettings: input.notificationsSettings,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update tag");
  }

  return response.json() as Promise<TagDto>;
}

async function deleteTag(tagId: string) {
  const response = await apiFetch(buildApiUrl(`/tags/${tagId}`), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete tag");
  }

  return response.json() as Promise<TagDto>;
}

export function useCreateTagMutation() {
  const { queryKey } = useFilteredTagsQueryData();
  return useOptimisticMutation<TagDto[], TagCreateInput>({
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
  });
}

export function useUpdateTagMutation() {
  const { queryKey } = useFilteredTagsQueryData();
  return useOptimisticMutation<TagDto[], TagUpdateInput>({
    queryKey,
    mutationFn: updateTag,
    updater: updateOptimisticTag,
    skipInvalidateOnSuccess: true,
  });
}

export function useDeleteTagMutation() {
  const { queryKey } = useFilteredTagsQueryData();
  return useOptimisticMutation<TagDto[], string>({
    queryKey,
    mutationFn: deleteTag,
    updater: removeOptimisticTag,
    skipInvalidateOnSuccess: true,
  });
}
