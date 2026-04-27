import {
  Center,
  Divider,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
} from "@mantine/core";

import { GuestRow } from "@/public-views/components/GuestRow";
import {
  usePublicViewGuestsDialogHandlers,
  useSelectedGuestsPublicViewId,
} from "@/public-views/hooks/dialogs/publicViewGuestsDialogHooks";
import { usePublicViewGuestsQuery } from "@/public-views/hooks/queries/usePublicViewGuestsQuery";

export function PublicViewGuestsDialog() {
  const publicViewId = useSelectedGuestsPublicViewId();
  const { close } = usePublicViewGuestsDialogHandlers();
  const { data, isLoading, isError } = usePublicViewGuestsQuery(publicViewId);

  return (
    <Modal opened={!!publicViewId} onClose={close} title="Guests" size="md">
      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : isError ? (
        <Text c="red">Failed to load guests.</Text>
      ) : !data || data.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          No one has signed in to this view yet.
        </Text>
      ) : (
        <Paper withBorder radius="md">
          <Stack gap={0}>
            {data.map((guest, idx) => (
              <div key={guest.id}>
                {idx > 0 && <Divider />}
                <GuestRow guest={guest} />
              </div>
            ))}
          </Stack>
        </Paper>
      )}
    </Modal>
  );
}
