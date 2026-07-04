import { Badge, Group, Text } from "@mantine/core";
import { IconTag } from "@tabler/icons-react";

import { usePublicTaggedMessageStatsQuery } from "@/public-schedule/hooks/queries/usePublicTaggedMessageStatsQuery";

interface Props {
  slug: string;
}

export function PublicTaggedStatsBar({ slug }: Props) {
  const { data } = usePublicTaggedMessageStatsQuery(slug);
  const resolved = data?.resolved ?? 0;
  const pending = data?.pending ?? 0;

  return (
    <Group gap="xs" align="center" wrap="nowrap">
      <IconTag size={16} />
      <Text size="sm" fw={500}>
        Tagged messages
      </Text>
      <Badge color="green" variant="light">
        {resolved} resolved
      </Badge>
      <Badge color="yellow" variant="light">
        {pending} pending
      </Badge>
    </Group>
  );
}
