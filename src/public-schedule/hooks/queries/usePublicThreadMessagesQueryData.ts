// One thread per guest session (with the view owner), keyed by slug.
export function publicThreadMessagesQueryKey(slug: string) {
  return ["public-thread-messages", slug] as const;
}

export const usePublicThreadMessagesQueryData = (slug: string) => {
  return { queryKey: publicThreadMessagesQueryKey(slug) };
};
