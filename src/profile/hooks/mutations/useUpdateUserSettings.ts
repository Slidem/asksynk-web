import { updateUserSettings } from "@/profile/apis/updateUserSettings";
import { useUserSettingsQueryData } from "@/profile/hooks/queries/useUserSettingsQueryData";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUserSettings() {
  const { queryKey } = useUserSettingsQueryData();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Could not update settings",
        message: error.message,
      });
    },
  });

  return {
    updateUserSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
