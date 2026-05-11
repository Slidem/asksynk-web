import { fetchFilteredTags } from "@/tags/apis/fetchFilteredTags";
import { useDebouncedCallback } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getFilteredTagsQueryKey } from "@/tags/hooks/queries/useFilteredTagsQueryData";
import type { TagDto } from "@/tags/models/tag";

interface SearchableUserTags {
  tags: TagDto[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedSearchValue: string;
}

export const useSearchableUserTags = (userId?: string): SearchableUserTags => {
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
      answerMode: "all",
      userId,
    }),
    queryFn: () =>
      fetchFilteredTags({
        search: debouncedSearch,
        answerMode: "all",
        userId,
      }),
    placeholderData: (prev) => prev ?? [],
  });

  return {
    tags: tags ?? [],
    searchValue: search,
    setSearchValue: updateSearchValue,
    debouncedSearchValue: debouncedSearch,
  };
};
