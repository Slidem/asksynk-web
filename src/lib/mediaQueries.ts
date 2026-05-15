import { useMediaQuery } from "@mantine/hooks";

/**
 * We're not intending to use SSR, so this should be the safe preferred way to do media queries, since it won't cause hydration mismatches.
 */
export const useIsDesktop = () => {
  return useMediaQuery("(min-width: 768px)", false, {
    getInitialValueInEffect: false,
  });
};
