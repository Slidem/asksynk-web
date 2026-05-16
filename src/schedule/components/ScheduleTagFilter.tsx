import { useEffect } from "react";

import { CalendarTagFilter } from "@/components/calendar/CalendarTagFilter";
import { useManageScheduleView } from "@/schedule/hooks/useManageScheduleView";
import { useScheduleView } from "@/schedule/hooks/useScheduleView";
import { useTimeblockTagsQuery } from "@/tags/hooks/queries/useTimeblockTagsQuery";

export function ScheduleTagFilter() {
  const { calendarTagIds, selectedUserId } = useScheduleView();
  const { setCalendarTagIds } = useManageScheduleView();
  const tags = useTimeblockTagsQuery(selectedUserId);

  useEffect(() => {
    setCalendarTagIds([]);
  }, [selectedUserId, setCalendarTagIds]);

  return (
    <CalendarTagFilter
      tags={tags}
      selectedTagIds={calendarTagIds}
      onChange={setCalendarTagIds}
    />
  );
}
