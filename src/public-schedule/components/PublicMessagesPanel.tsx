import { Alert, Stack } from "@mantine/core";
import { IconBulb } from "@tabler/icons-react";
import { useState } from "react";

import { PublicMessageComposer } from "@/public-schedule/components/PublicMessageComposer";
import { PublicMessageList } from "@/public-schedule/components/PublicMessageList";
import { PublicTaggedStatsBar } from "@/public-schedule/components/PublicTaggedStatsBar";
import { useGuestMessageSocket } from "@/public-schedule/hooks/useGuestMessageSocket";
import type { PublicViewMetadataDto } from "@/public-schedule/models/publicView";

interface Props {
  slug: string;
  view: PublicViewMetadataDto;
}

// Direct-message view between the guest and the public-view owner (ASK-12).
// No threads sidebar — a single conversation, with tagged-message stats above
// the message list.
export function PublicMessagesPanel({ slug, view }: Props) {
  const [tipDismissed, setTipDismissed] = useState(false);
  useGuestMessageSocket(slug);

  return (
    <Stack gap="sm" style={{ flex: 1, minHeight: 0 }}>
      {!tipDismissed && (
        <Alert
          variant="light"
          color="blue"
          icon={<IconBulb size={16} />}
          withCloseButton
          onClose={() => setTipDismissed(true)}
          p="xs"
        >
          Tip: type <b>/</b> in the message box for quick actions — e.g. tag
          your message so the owner knows how to route it.
        </Alert>
      )}
      <Stack
        gap="sm"
        pb="sm"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
        }}
      >
        <PublicTaggedStatsBar slug={slug} />
      </Stack>
      <PublicMessageList
        slug={slug}
        ownerUserId={view.ownerUserId}
        ownerName={view.name}
        ownerImage={view.ownerImage}
      />
      <PublicMessageComposer slug={slug} ownerUserId={view.ownerUserId} />
    </Stack>
  );
}
