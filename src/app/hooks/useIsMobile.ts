import { useMediaQuery } from "@mantine/hooks";

// True below the `sm` breakpoint (48em). Drives mobile-only UI branches
// (fullScreen dialogs, etc). Undefined on first paint → treated as desktop.
export function useIsMobile() {
  return useMediaQuery("(max-width: 48em)") ?? false;
}
