import { fetchPublicViewGuests } from "@/public-views/apis/fetchPublicViewGuests";
import { publicViewGuestsQueryKey } from "@/public-views/hooks/queries/usePublicViewGuestsQueryData";
import { useQuery } from "@tanstack/react-query";

export function usePublicViewGuestsQuery(publicViewId: string | null) {
  return useQuery({
    queryKey: publicViewId
      ? publicViewGuestsQueryKey(publicViewId)
      : ["public-views", "guests-disabled"],
    queryFn: () => fetchPublicViewGuests(publicViewId!),
    enabled: !!publicViewId,
  });
}
