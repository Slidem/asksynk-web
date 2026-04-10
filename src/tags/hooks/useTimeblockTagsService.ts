import type { UUID } from "uuidv7";
import type { TagDto } from "../models/tag";
import { useCreateQuickTag } from "./mutations/useCreateQuickTag";
import { useSearchableTimeblockTags } from "./queries/useTimeblockTags";
import type { TagsFilters } from "../models/filters";
import { useMemo } from "react";

interface UseQuickTimeblockTags {
  tags: TagDto[];
  create: (name: string) => UUID | null;
  isCreating: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const useTimeblockTagsService = (): UseQuickTimeblockTags => {
  const { tags, searchValue, setSearchValue, debouncedSearchValue } =
    useSearchableTimeblockTags();

  const queryKey: ["tags", TagsFilters] = useMemo(
    () => ["tags", { search: debouncedSearchValue, answerMode: "timeblock" }],
    [debouncedSearchValue],
  );

  const { quickCreateTag, isCreating } = useCreateQuickTag(queryKey);

  return {
    tags,
    searchValue,
    setSearchValue,
    isCreating,
    create: quickCreateTag,
  };
};
