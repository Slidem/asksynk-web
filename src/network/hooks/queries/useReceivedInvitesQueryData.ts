export function receivedInvitesQueryKey() {
  return ["network", "invites", "received"] as const;
}

export const useReceivedInvitesQueryData = () => {
  return { queryKey: receivedInvitesQueryKey() };
};
