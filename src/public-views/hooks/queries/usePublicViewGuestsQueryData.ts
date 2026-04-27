export function publicViewGuestsQueryKey(publicViewId: string) {
  return ["public-views", publicViewId, "guests"] as const;
}
