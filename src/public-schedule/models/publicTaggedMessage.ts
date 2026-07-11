// Per-status counts of the guest's tagged messages in the thread.
// pending (shown in UI) = created + inProgress.
export interface PublicTaggedMessageStats {
  created: number;
  inProgress: number;
  resolved: number;
}
