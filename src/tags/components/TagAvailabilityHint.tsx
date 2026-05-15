import { Badge, Loader } from "@mantine/core";
import { IconBolt, IconClock } from "@tabler/icons-react";

import { useUpcomingTagCalendarEvents } from "@/schedule/hooks/queries/useUpcomingTagCalendarEvents";
import { formatRelativeTime } from "@/schedule/utils/formatRelativeTime";
import type { TagDto } from "@/tags/models/tag";
import { formatResponseTime } from "@/tags/utils/responseTime";

interface Props {
  tag: TagDto;
  userId?: string;
}

export function TagAvailabilityHint({ tag, userId }: Props) {
  if (tag.answerMode.type === "immediately") {
    return (
      <Badge
        size="xs"
        variant="light"
        color="green"
        leftSection={<IconBolt size={10} />}
      >
        ~{formatResponseTime(tag.answerMode.responseTimeMillis)}
      </Badge>
    );
  }
  return <TimeblockHint tagId={tag.id} userId={userId} />;
}

function TimeblockHint({ tagId, userId }: { tagId: string; userId?: string }) {
  const { data, isLoading } = useUpcomingTagCalendarEvents(tagId, userId);

  if (isLoading) return <Loader size="xs" />;

  const next = data?.[0];
  if (!next) {
    return (
      <Badge size="xs" variant="light" color="gray">
        No upcoming
      </Badge>
    );
  }
  return (
    <Badge
      size="xs"
      variant="light"
      color="blue"
      leftSection={<IconClock size={10} />}
    >
      {formatRelativeTime(next.start)}
    </Badge>
  );
}
