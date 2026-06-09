import { updateProfile } from "@/profile/apis/updateProfile";
import { useProfileQueryData } from "@/profile/hooks/queries/useProfileQueryData";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfile() {
  const { queryKey } = useProfileQueryData();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      notifications.show({
        color: "green",
        title: "Profile updated",
        message: "Your changes have been saved.",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Could not update profile",
        message: error.message,
      });
    },
  });

  return { updateProfile: mutation.mutateAsync, isUpdating: mutation.isPending };
}
