import { fetchUserSettings } from "@/profile/apis/fetchUserSettings";
import { useUserSettingsQueryData } from "@/profile/hooks/queries/useUserSettingsQueryData";
import { useQuery } from "@tanstack/react-query";

export function useUserSettings() {
  const { queryKey } = useUserSettingsQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchUserSettings,
  });
}
