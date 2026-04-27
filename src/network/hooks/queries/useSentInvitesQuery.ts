import { fetchSentInvites } from "@/network/apis/fetchSentInvites";
import { useSentInvitesQueryData } from "@/network/hooks/queries/useSentInvitesQueryData";
import { useQuery } from "@tanstack/react-query";

export function useSentInvitesQuery() {
  const { queryKey } = useSentInvitesQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchSentInvites,
    placeholderData: [],
  });
}
