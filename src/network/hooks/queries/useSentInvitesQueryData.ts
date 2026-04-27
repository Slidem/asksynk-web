export function sentInvitesQueryKey() {
  return ["network", "invites", "sent"] as const;
}

export const useSentInvitesQueryData = () => {
  return { queryKey: sentInvitesQueryKey() };
};
