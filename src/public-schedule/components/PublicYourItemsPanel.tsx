import {
  Badge,
  Center,
  Loader,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconInbox } from "@tabler/icons-react";
import { useMemo } from "react";

import { PublicTaggedMessageCard } from "@/public-schedule/components/PublicTaggedMessageCard";
import { usePublicTaggedMessagesQuery } from "@/public-schedule/hooks/queries/usePublicTaggedMessagesQuery";
import type { PublicViewMetadataDto } from "@/public-schedule/models/publicView";
import { CollapsibleSection } from "@/tasks/components/CollapsibleSection";

interface Props {
  slug: string;
  view: PublicViewMetadataDto;
}

export function PublicYourItemsPanel({ slug, view }: Props) {
  const { data, isLoading, isError } = usePublicTaggedMessagesQuery(slug);

  const { pending, resolved } = useMemo(() => {
    const messages = data ?? [];
    return {
      pending: messages.filter((m) => m.managedStatus?.status !== "resolved"),
      resolved: messages.filter((m) => m.managedStatus?.status === "resolved"),
    };
  }, [data]);

  if (isLoading) {
    return (
      <Center style={{ flex: 1, minHeight: 0 }}>
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center style={{ flex: 1, minHeight: 0 }}>
        <Text c="red">Failed to load your items.</Text>
      </Center>
    );
  }

  if (pending.length === 0 && resolved.length === 0) {
    return (
      <Center style={{ flex: 1, minHeight: 0 }}>
        <Stack align="center" gap="xs">
          <ThemeIcon variant="light" size="xl" radius="xl" color="gray">
            <IconInbox size={22} />
          </ThemeIcon>
          <Text fw={500}>No items yet</Text>
          <Text size="sm" c="dimmed">
            Tagged messages you send will show up here.
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <ScrollArea flex={1} scrollbars="y" py="sm">
      <Stack gap="md">
        <CollapsibleSection
          title="Pending"
          defaultOpen
          action={
            <Badge color="yellow" variant="light">
              {pending.length}
            </Badge>
          }
        >
          <Stack gap="sm">
            {pending.map((message) => (
              <PublicTaggedMessageCard
                key={message.id}
                message={message}
                ownerUserId={view.ownerUserId}
              />
            ))}
          </Stack>
        </CollapsibleSection>
        <CollapsibleSection
          title="Resolved"
          defaultOpen={false}
          action={
            <Badge color="green" variant="light">
              {resolved.length}
            </Badge>
          }
        >
          <Stack gap="sm">
            {resolved.map((message) => (
              <PublicTaggedMessageCard
                key={message.id}
                message={message}
                ownerUserId={view.ownerUserId}
              />
            ))}
          </Stack>
        </CollapsibleSection>
      </Stack>
    </ScrollArea>
  );
}
