import { Group, Select, TextInput } from "@mantine/core";
import { IconArrowsSort, IconSearch, IconTag } from "@tabler/icons-react";
import type {
  OrderByFilterValue,
  OrderDirectionFilterValue,
  TagAnserModeFilterValue,
} from "@/tags/models/filters";
import { useTagsFilter, useUpdateTagFilter } from "@/tags/hooks/filters";

import { useDebouncedCallback } from "@mantine/hooks";
import { useState } from "react";

const SearchFilter = () => {
  const [search, setSearch] = useState("");
  const updateFilter = useUpdateTagFilter();
  const updateSearch = useDebouncedCallback((value: string) => {
    updateFilter("search", value);
  }, 500);

  return (
    <TextInput
      label="Search"
      placeholder="Search tags"
      leftSection={<IconSearch size={16} />}
      value={search}
      onChange={(event) => {
        const nextValue = event.currentTarget.value;
        setSearch(nextValue);
        updateSearch(nextValue);
      }}
    />
  );
};

const AnswerModeFilter = () => {
  const value = useTagsFilter("answerMode");
  const updateFilter = useUpdateTagFilter();

  return (
    <Select
      label="Answer mode"
      leftSection={<IconTag size={16} />}
      value={value}
      onChange={(next) =>
        updateFilter("answerMode", (next ?? "all") as TagAnserModeFilterValue)
      }
      data={[
        { value: "all", label: "All modes" },
        { value: "timeblock", label: "Timeblock" },
        { value: "immediately", label: "Immediately" },
      ]}
    />
  );
};

const OrderByFilter = () => {
  const value = useTagsFilter("orderBy");
  const updateFilter = useUpdateTagFilter();

  return (
    <Select
      label="Order by"
      leftSection={<IconArrowsSort size={16} />}
      value={value}
      onChange={(next) =>
        updateFilter("orderBy", (next ?? "updatedAt") as OrderByFilterValue)
      }
      data={[
        { value: "updatedAt", label: "Last updated" },
        { value: "createdAt", label: "Created" },
      ]}
    />
  );
};

const DirectionFilter = () => {
  const value = useTagsFilter("orderDirection");
  const updateFilter = useUpdateTagFilter();

  return (
    <Select
      label="Direction"
      leftSection={<IconArrowsSort size={16} />}
      value={value}
      onChange={(next) =>
        updateFilter(
          "orderDirection",
          (next ?? "desc") as OrderDirectionFilterValue,
        )
      }
      data={[
        { value: "desc", label: "Newest" },
        { value: "asc", label: "Oldest" },
      ]}
    />
  );
};

export function TagsFilters() {
  return (
    <Group gap="sm" align="end" wrap="wrap">
      <SearchFilter />
      <AnswerModeFilter />
      <OrderByFilter />
      <DirectionFilter />
    </Group>
  );
}
