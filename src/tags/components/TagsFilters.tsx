import { Group, Select, TextInput } from "@mantine/core";
import { IconArrowsSort, IconSearch, IconTag } from "@tabler/icons-react";

import type { TagAnswerMode } from "@/tags/models/tag";

export interface TagsFiltersValue {
  search: string;
  answerMode: TagAnswerMode | "all";
  orderBy: "createdAt" | "updatedAt";
  orderDirection: "asc" | "desc";
}

interface TagsFiltersProps {
  value: TagsFiltersValue;
  onChange: (value: TagsFiltersValue) => void;
}

export function TagsFilters({ value, onChange }: TagsFiltersProps) {
  const update = (patch: Partial<TagsFiltersValue>) => {
    onChange({ ...value, ...patch });
  };

  return (
    <Group gap="sm" align="end" wrap="wrap">
      <TextInput
        label="Search"
        placeholder="Search tags"
        leftSection={<IconSearch size={16} />}
        value={value.search}
        onChange={(event) => update({ search: event.currentTarget.value })}
      />

      <Select
        label="Answer mode"
        leftSection={<IconTag size={16} />}
        value={value.answerMode}
        onChange={(next) =>
          update({ answerMode: (next ?? "all") as TagAnswerMode | "all" })
        }
        data={[
          { value: "all", label: "All modes" },
          { value: "timeblock", label: "Timeblock" },
          { value: "immediately", label: "Immediately" },
        ]}
      />

      <Select
        label="Order by"
        leftSection={<IconArrowsSort size={16} />}
        value={value.orderBy}
        onChange={(next) =>
          update({ orderBy: (next ?? "updatedAt") as TagsFiltersValue["orderBy"] })
        }
        data={[
          { value: "updatedAt", label: "Last updated" },
          { value: "createdAt", label: "Created" },
        ]}
      />

      <Select
        label="Direction"
        leftSection={<IconArrowsSort size={16} />}
        value={value.orderDirection}
        onChange={(next) =>
          update({
            orderDirection: (next ?? "desc") as TagsFiltersValue["orderDirection"],
          })
        }
        data={[
          { value: "desc", label: "Newest" },
          { value: "asc", label: "Oldest" },
        ]}
      />
    </Group>
  );
}
