import { useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

import { useManageScheduleView } from "@/schedule/hooks/useManageScheduleView";

export const useSyncSelectedUserFromUrl = () => {
  const { userId } = useSearch({ from: "/_authenticated/schedule" });
  const { setSelectedUserId } = useManageScheduleView();

  useEffect(() => {
    setSelectedUserId(userId ?? null);
    return () => setSelectedUserId(null);
  }, [userId, setSelectedUserId]);
};
