import type {
  TagCreateInput,
  TagDto,
  TagUpdateInput,
} from "@/tags/models/tag";
import { apiFetch, buildApiUrl } from "@/lib/api";
import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import { tagsQueryKey } from "@/tags/hooks/queries";

function createTempId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `temp-${crypto.randomUUID()}`;
  }

  return `temp-${Math.random().toString(36).slice(2)}`;
}

function addOptimisticTag(
  previous: TagDto[] | undefined,
  input: TagCreateInput,
): TagDto[] {
  const nextTag: TagDto = {
    id: createTempId(),
    userId: "pending",
    name: input.name,
    description: input.description,
    color: input.color,
    answerMode: input.answerMode,
    responseTimeMillis: input.responseTimeMillis,
    notificationsSettings: input.notificationsSettings,
  };

  return [...(previous ?? []), nextTag];
}

function updateOptimisticTag(
  previous: TagDto[] | undefined,
  input: TagUpdateInput,
): TagDto[] {
  if (!previous) return [];

  return previous.map((tag) =>
    tag.id === input.id
      ? {
          ...tag,
          ...input,
          notificationsSettings:
            input.notificationsSettings ?? tag.notificationsSettings,
        }
      : tag,
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
      responseTimeMillis: input.responseTimeMillis,
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

export function useCreateTagMutation(
  queryKey: ReturnType<typeof tagsQueryKey>,
) {
  return useOptimisticMutation<TagDto[], TagCreateInput>({
    queryKey,
    mutationFn: createTag,
    updater: addOptimisticTag,
    skipInvalidateOnSuccess: true,
  });
}

export function useUpdateTagMutation(
  queryKey: ReturnType<typeof tagsQueryKey>,
) {
  return useOptimisticMutation<TagDto[], TagUpdateInput>({
    queryKey,
    mutationFn: updateTag,
    updater: updateOptimisticTag,
    skipInvalidateOnSuccess: true,
  });
}

export function useDeleteTagMutation(
  queryKey: ReturnType<typeof tagsQueryKey>,
) {
  return useOptimisticMutation<TagDto[], string>({
    queryKey,
    mutationFn: deleteTag,
    updater: removeOptimisticTag,
    skipInvalidateOnSuccess: true,
  });
}
