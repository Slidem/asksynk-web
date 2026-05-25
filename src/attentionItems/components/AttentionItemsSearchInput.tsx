import { TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

import { useAttentionItemsSearchStore } from "@/attentionItems/store/attentionItemsSearchStore";

export function AttentionItemsSearchInput() {
  const setQuery = useAttentionItemsSearchStore((s) => s.setQuery);
  const [value, setValue] = useState("");
  const debounced = useDebouncedCallback((q: string) => setQuery(q), 200);

  return (
    <TextInput
      placeholder="Search attention items..."
      leftSection={<IconSearch size={16} />}
      value={value}
      onChange={(event) => {
        setValue(event.currentTarget.value);
        debounced(event.currentTarget.value);
      }}
    />
  );
}
