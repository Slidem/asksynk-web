import { Avatar, Group, Stack, Text, Tooltip } from "@mantine/core";
import type { AvatarProps } from "@mantine/core";

export type UserBadgeVariant = "avatar" | "name" | "full";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  variant?: UserBadgeVariant;
  size?: AvatarProps["size"];
  color?: AvatarProps["color"];
}

function getInitials(source: string) {
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserBadge({
  name,
  email,
  image,
  variant = "full",
  size = "md",
  color = "blue",
}: Props) {
  const displayName = name || email || "User";
  const initials = getInitials(displayName);

  const avatar = (
    <Avatar src={image ?? undefined} radius="xl" size={size} color={color}>
      {initials}
    </Avatar>
  );

  if (variant === "avatar") {
    return <Tooltip label={displayName}>{avatar}</Tooltip>;
  }

  if (variant === "name") {
    return (
      <Group gap="xs" wrap="nowrap">
        {avatar}
        <Text size="sm" fw={500}>
          {displayName}
        </Text>
      </Group>
    );
  }

  return (
    <Group gap="md" wrap="nowrap">
      {avatar}
      <Stack gap={2}>
        <Text fw={500}>{displayName}</Text>
        {email && name && (
          <Text size="xs" c="dimmed">
            {email}
          </Text>
        )}
      </Stack>
    </Group>
  );
}
