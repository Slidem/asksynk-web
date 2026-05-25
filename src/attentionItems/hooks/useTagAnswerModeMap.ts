import { useMemo } from "react";

import { useUserTags } from "@/tags/hooks/queries/useUserTags";
import type { TagAnswerMode, TagDto } from "@/tags/models/tag";

export function useTagAnswerModeMap(): Map<string, TagAnswerMode> {
  const { data: tags } = useUserTags();

  return useMemo(() => {
    const map = new Map<string, TagAnswerMode>();
    (tags as TagDto[] | undefined)?.forEach((tag) =>
      map.set(tag.id, tag.answerMode.type),
    );
    return map;
  }, [tags]);
}
