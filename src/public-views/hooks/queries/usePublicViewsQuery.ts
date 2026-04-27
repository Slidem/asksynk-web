import { fetchPublicViews } from "@/public-views/apis/fetchPublicViews";
import { usePublicViewsQueryData } from "@/public-views/hooks/queries/usePublicViewsQueryData";
import { useQuery } from "@tanstack/react-query";

export function usePublicViewsQuery() {
  const { queryKey } = usePublicViewsQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchPublicViews,
    placeholderData: [],
  });
}
