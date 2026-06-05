import { fetchTimer } from "@/timer/apis/fetchTimer";
import { useQuery } from "@tanstack/react-query";
import { useTimerQueryData } from "./useTimerQueryData";

export function useTimer() {
  const { queryKey } = useTimerQueryData();
  return useQuery({
    queryKey,
    queryFn: fetchTimer,
  });
}
