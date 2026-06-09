import { fetchProfile } from "@/profile/apis/fetchProfile";
import { useProfileQueryData } from "@/profile/hooks/queries/useProfileQueryData";
import { useQuery } from "@tanstack/react-query";

export function useProfile() {
  const { queryKey } = useProfileQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchProfile,
  });
}
