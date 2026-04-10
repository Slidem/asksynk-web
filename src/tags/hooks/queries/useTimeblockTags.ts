import { fetchFilteredTags } from "@/tags/apis/fetchFilteredTags";
import { useDebouncedCallback } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getFilteredTagsQueryKey } from "./useFilteredTagsQueryData";
import type { TagDto } from "@/tags/models/tag";

interface TimeblockTags {
  /**
   * The list of tags that match the current search criteria. This list is updated whenever the debounced search value changes, which happens 300ms after the user stops typing in the search input.
   */
  tags: TagDto[];
  /**
   * The current search value for filtering tags. This value is updated immediately as the user types, but the actual fetching of tags is debounced to avoid excessive API calls.
   */
  searchValue: string;
  /**
   *  Updates the searchValue, which is used for fetching tags. This function is debounced, so it will only update the searchValue 300ms after the user stops typing.
   */
  setSearchValue: (value: string) => void;
  /**
   * This is the debounced value of searchValue, which is used for fetching tags. It updates 300ms after the user stops typing.
   */
  debouncedSearchValue: string;
}

export const useSearchableTimeblockTags = (): TimeblockTags => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const handleSearchChange = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
  }, 300);

  const updateSearchValue = (value: string) => {
    setSearch(value);
    handleSearchChange(value);
  };

  const { data: tags } = useQuery({
    queryKey: getFilteredTagsQueryKey({
      search: debouncedSearch,
      answerMode: "timeblock",
    }),
    queryFn: () =>
      fetchFilteredTags({ search: debouncedSearch, answerMode: "timeblock" }),
    placeholderData: (prev) => prev ?? [],
  });

  return {
    tags: tags ?? [],
    searchValue: search,
    setSearchValue: updateSearchValue,
    debouncedSearchValue: debouncedSearch,
  };
};
