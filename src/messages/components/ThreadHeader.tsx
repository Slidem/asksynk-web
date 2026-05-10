import { ActionIcon, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { UserBadge } from "@/components/UserBadge";
import type { ThreadOtherParticipant } from "@/messages/models/thread";

interface Props {
  other: ThreadOtherParticipant;
  showBack: boolean;
}

export function ThreadHeader({ other, showBack }: Props) {
  const navigate = useNavigate();

  const name =
    other.kind === "user" ? other.name || other.email : other.displayName;
  const email = other.kind === "user" ? other.email : null;
  const image = other.kind === "user" ? other.image : null;

  return (
    <Group
      px="md"
      py="sm"
      gap="sm"
      style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}
    >
      {showBack && (
        <ActionIcon
          variant="subtle"
          aria-label="Back to inbox"
          onClick={() => navigate({ to: "/messages" })}
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
      )}
      <UserBadge name={name} email={email} image={image} variant="full" />
    </Group>
  );
}
