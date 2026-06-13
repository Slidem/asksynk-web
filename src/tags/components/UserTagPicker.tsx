import { useMemo, useState } from "react";

import { useSession } from "@/auth";
import { TagChecklistPicker } from "@/tags/components/TagChecklistPicker";
import { useUserTags } from "@/tags/hooks/queries/useUserTags";

interface UserTagPickerProps {
  // Whose tags to pick from; undefined (or own id) = own tags. Used for task
  // tagging (own) and suggestions (suggestee's tags, network-gated by backend).
  userId?: string;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  disabled?: boolean;
}

export function UserTagPicker({
  userId,
  selectedTagIds,
  onChange,
  disabled = false,
}: UserTagPickerProps) {
  const { data: session } = useSession();
  // Self goes through the canonical own-tags key (userId omitted).
  const targetUserId = userId === session?.user?.id ? undefined : userId;

  const { data: tags = [] } = useUserTags(targetUserId);
  const [searchValue, setSearchValue] = useState("");

  const filteredTags = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) return tags;
    return tags.filter((tag) => tag.name.toLowerCase().includes(search));
  }, [tags, searchValue]);

  return (
    <TagChecklistPicker
      tags={filteredTags}
      selectedTagIds={selectedTagIds}
      onChange={onChange}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      disabled={disabled}
      withAvailabilityHints
      hintUserId={targetUserId}
    />
  );
}
