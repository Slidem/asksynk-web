import { fetchReceivedInvites } from "@/network/apis/fetchReceivedInvites";
import { useReceivedInvitesQueryData } from "@/network/hooks/queries/useReceivedInvitesQueryData";
import { useQuery } from "@tanstack/react-query";

export function useReceivedInvitesQuery() {
  const { queryKey } = useReceivedInvitesQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchReceivedInvites,
    placeholderData: [],
  });
}
