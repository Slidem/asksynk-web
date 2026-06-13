import { useCallback, useMemo } from "react";

import { TagChecklistPicker } from "@/tags/components/TagChecklistPicker";
import { useTimeblockTagsService } from "../hooks/useTimeblockTagsService";

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

// Timeblock-tag picker with quick-create (schedule flows).
export function TagSelector({ selectedTagIds, onChange }: TagSelectorProps) {
  const { tags, searchValue, setSearchValue, create, isCreating } =
    useTimeblockTagsService();

  const hasExactMatch = useMemo(
    () =>
      tags.some(
        (t) => t.name.toLowerCase() === searchValue.trim().toLowerCase(),
      ),
    [searchValue, tags],
  );

  const showCreate = useMemo(
    () => searchValue.trim().length > 0 && !hasExactMatch && !isCreating,
    [searchValue, hasExactMatch, isCreating],
  );

  const handleCreate = useCallback(() => {
    const createdId = create(searchValue.trim());
    if (!createdId) {
      return;
    }
    onChange([...selectedTagIds, createdId.toString()]);
    setSearchValue("");
  }, [create, onChange, searchValue, selectedTagIds, setSearchValue]);

  return (
    <TagChecklistPicker
      tags={tags}
      selectedTagIds={selectedTagIds}
      onChange={onChange}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      onCreate={handleCreate}
      showCreate={showCreate}
    />
  );
}
