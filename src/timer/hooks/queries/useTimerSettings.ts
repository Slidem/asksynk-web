import { fetchTimerSettings } from "@/timer/apis/fetchTimerSettings";
import { useQuery } from "@tanstack/react-query";
import { useTimerSettingsQueryData } from "./useTimerSettingsQueryData";

export function useTimerSettings() {
  const { queryKey } = useTimerSettingsQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchTimerSettings,
  });
}
