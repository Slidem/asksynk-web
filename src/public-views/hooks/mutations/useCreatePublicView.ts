import { createPublicView } from "@/public-views/apis/createPublicView";
import { publicViewsQueryKey } from "@/public-views/hooks/queries/usePublicViewsQueryData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

export function useCreatePublicView() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createPublicView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: publicViewsQueryKey() });
      notifications.show({
        color: "green",
        title: "Public view created",
        message: "Share the link to give read-only access.",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        color: "red",
        title: "Could not create view",
        message: error.message,
      });
    },
  });
  return { create: mutation.mutate, isCreating: mutation.isPending };
}
