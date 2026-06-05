import { useTimerSettingsDialogStore } from "@/timer/store/timerSettingsDialogStore";
import { useShallow } from "zustand/shallow";

export const useIsTimerSettingsDialogOpened = () =>
  useTimerSettingsDialogStore((state) => state.opened);

export const useTimerSettingsDialogHandlers = () =>
  useTimerSettingsDialogStore(
    useShallow((state) => ({ open: state.open, close: state.close })),
  );
