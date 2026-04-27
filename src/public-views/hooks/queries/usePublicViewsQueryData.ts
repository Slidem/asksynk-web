export function publicViewsQueryKey() {
  return ["public-views"] as const;
}

export const usePublicViewsQueryData = () => {
  return { queryKey: publicViewsQueryKey() };
};
