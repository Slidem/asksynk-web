import type { UUID } from "uuidv7";
import { useMemo } from "react";
import type { TagDto } from "@/tags/models/tag";
import type { TagsFilters } from "@/tags/models/filters";
import { useCreateQuickTag } from "@/tags/hooks/mutations/useCreateQuickTag";
import { useSearchableUserTags } from "@/tags/hooks/queries/useSearchableUserTags";

interface UseUserTagsService {
  tags: TagDto[];
  /** Inline-create returns null when `userId` is set (can't create tags for another user). */
  create: (name: string) => UUID | null;
  isCreating: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  canCreate: boolean;
}

export const useUserTagsService = (userId?: string): UseUserTagsService => {
  const { tags, searchValue, setSearchValue, debouncedSearchValue } =
    useSearchableUserTags(userId);

  const queryKey: ["tags", TagsFilters] = useMemo(
    () => [
      "tags",
      { search: debouncedSearchValue, answerMode: "all", userId },
    ],
    [debouncedSearchValue, userId],
  );

  const { quickCreateTag, isCreating } = useCreateQuickTag(queryKey);
  const canCreate = !userId;

  return {
    tags,
    searchValue,
    setSearchValue,
    isCreating,
    create: canCreate ? quickCreateTag : () => null,
    canCreate,
  };
};
