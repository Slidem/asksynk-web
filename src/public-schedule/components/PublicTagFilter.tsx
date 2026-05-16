import { CalendarTagFilter } from "@/components/calendar/CalendarTagFilter";
import {
  usePublicCalendarTagFilter,
  useSetPublicCalendarTagIds,
} from "@/public-schedule/hooks/usePublicScheduleView";
import { useUserTags } from "@/tags/hooks/queries/useUserTags";

interface Props {
  ownerUserId: string;
}

export function PublicTagFilter({ ownerUserId }: Props) {
  const { data: tags } = useUserTags(ownerUserId, (all) =>
    all.filter((t) => t.answerMode.type === "timeblock"),
  );
  const selectedTagIds = usePublicCalendarTagFilter();
  const setCalendarTagIds = useSetPublicCalendarTagIds();

  return (
    <CalendarTagFilter
      tags={tags ?? []}
      selectedTagIds={selectedTagIds}
      onChange={setCalendarTagIds}
    />
  );
}
