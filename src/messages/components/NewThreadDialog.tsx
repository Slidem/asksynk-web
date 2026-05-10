import {
  Center,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { UserBadge } from "@/components/UserBadge";
import { useCreateOrGetThread } from "@/messages/hooks/mutations/useCreateOrGetThread";
import {
  useIsNewThreadDialogOpened,
  useNewThreadDialogHandlers,
} from "@/messages/hooks/dialogs/newThreadDialogHooks";
import { useNetworkConnectionsQuery } from "@/network/hooks/queries/useNetworkConnectionsQuery";

export function NewThreadDialog() {
  const opened = useIsNewThreadDialogOpened();
  const { close } = useNewThreadDialogHandlers();
  const { data: connections, isLoading } = useNetworkConnectionsQuery();
  const { startThread, isStarting } = useCreateOrGetThread();
  const navigate = useNavigate();

  const handlePick = (recipientUserId: string) => {
    startThread(recipientUserId, ({ threadId }) => {
      close();
      navigate({ to: "/messages/$threadId", params: { threadId } });
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Start a conversation"
      size="md"
    >
      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : !connections || connections.length === 0 ? (
        <Stack align="center" py="xl" gap="xs">
          <Text c="dimmed" size="sm">
            No connections yet. Invite someone from the Network page.
          </Text>
        </Stack>
      ) : (
        <ScrollArea.Autosize mah={400}>
          <Stack gap={4}>
            {connections.map((c) => (
              <UnstyledButton
                key={c.userId}
                onClick={() => handlePick(c.userId)}
                disabled={isStarting}
                p="sm"
                style={{ borderRadius: 8 }}
              >
                <UserBadge
                  name={c.name}
                  email={c.email}
                  image={c.image}
                  variant="full"
                />
              </UnstyledButton>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      )}
    </Modal>
  );
}
