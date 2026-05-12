import { Box, Group, Menu, UnstyledButton } from "@mantine/core";
import { IconCalendar, IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

import { useSession } from "@/auth";
import { UserBadge } from "@/components/UserBadge";
import { getConnectionDisplayName } from "@/lib/connections";
import { getMyDisplayName } from "@/lib/user";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";
import { useScheduleView } from "@/schedule/hooks/useScheduleView";

export function CalendarUserRow() {
  const navigate = useNavigate();
  const { selectedUserId } = useScheduleView();
  const { data: session } = useSession();
  const { data: connections } = useNetworkConnectionsQuery();
  const myDisplayName = getMyDisplayName(session?.user);

  const selectedConnection = useMemo(
    () => connections?.find((c) => c.userId === selectedUserId) ?? null,
    [connections, selectedUserId],
  );

  const sessionUser = session?.user;

  const isSelf = selectedUserId === null;

  const targetName = isSelf
    ? myDisplayName
    : getConnectionDisplayName(selectedConnection!);

  const targetEmail = isSelf ? "Your schedule" : selectedConnection?.email;
  const targetImage = isSelf
    ? (sessionUser?.image ?? null)
    : (selectedConnection?.image ?? null);

  const goToSelf = () =>
    navigate({ to: "/schedule", search: { userId: undefined } });

  const goToConnection = (userId: string) =>
    navigate({ to: "/schedule", search: { userId } });

  return (
    <Box
      style={{
        borderBottom: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Menu shadow="md" width={280} position="bottom-start">
        <Menu.Target>
          <UnstyledButton p="sm" w="100%">
            <Group gap="sm" justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <IconCalendar size={18} color="var(--mantine-color-dimmed)" />
                <UserBadge
                  variant="full"
                  name={targetName}
                  email={targetEmail}
                  image={targetImage}
                  size="sm"
                />
              </Group>
              <IconChevronDown size={16} color="var(--mantine-color-dimmed)" />
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Switch calendar</Menu.Label>
          <Menu.Item
            onClick={goToSelf}
            rightSection={isSelf ? <IconCheck size={14} /> : null}
          >
            <UserBadge
              variant="name"
              name={`${getMyDisplayName(sessionUser)} (You)`}
              image={sessionUser?.image ?? null}
              size="sm"
            />
          </Menu.Item>
          {connections && connections.length > 0 && <Menu.Divider />}
          {connections?.map((c) => {
            const name = getConnectionDisplayName(c);
            const isActive = c.userId === selectedUserId;
            return (
              <Menu.Item
                key={c.userId}
                onClick={() => goToConnection(c.userId)}
                rightSection={isActive ? <IconCheck size={14} /> : null}
              >
                <UserBadge
                  variant="name"
                  name={name}
                  image={c.image}
                  size="sm"
                />
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
