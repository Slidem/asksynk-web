import { useOptimisticMutation } from "@/lib/useOptimisticMutation";
import type { PublicViewDto } from "@/public-views/models/publicView";
import { revokePublicView } from "@/public-views/apis/revokePublicView";
import { usePublicViewsQueryData } from "@/public-views/hooks/queries/usePublicViewsQueryData";
import { notifications } from "@mantine/notifications";

export function useRevokePublicView() {
  const { queryKey } = usePublicViewsQueryData();
  const mutation = useOptimisticMutation<PublicViewDto[], string>({
    queryKey,
    mutationFn: revokePublicView,
    updater: (previous, id) => (previous ?? []).filter((v) => v.id !== id),
    skipInvalidateOnSuccess: false,
    onSuccess: () => {
      notifications.show({
        color: "gray",
        title: "Public view revoked",
        message: "Existing guest sessions are now invalid.",
      });
    },
  });
  return { revoke: mutation.mutate, isRevoking: mutation.isPending };
}
