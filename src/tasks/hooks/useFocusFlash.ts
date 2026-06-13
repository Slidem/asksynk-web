import { useCallback, useEffect, useRef, useState } from "react";

// Scroll-to + temporary highlight for deep links (same pattern as MessageList's
// focusMessageId handling). `itemsReady` re-runs the effect once the target's
// data has loaded and the element is mounted.
export function useFocusFlash(
  focusId: string | undefined,
  itemsReady: unknown,
) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const nodesRef = useRef<Map<string, HTMLElement>>(new Map());
  const focusedHandledRef = useRef<string | null>(null);

  const registerNode = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) {
        nodesRef.current.set(id, el);
      } else {
        nodesRef.current.delete(id);
      }
    },
    [],
  );

  useEffect(() => {
    if (!focusId) {
      focusedHandledRef.current = null;
      return;
    }
    if (focusedHandledRef.current === focusId) {
      return;
    }
    const el = nodesRef.current.get(focusId);
    if (!el) {
      return;
    }
    focusedHandledRef.current = focusId;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    setHighlightedId(focusId);
    const timer = window.setTimeout(() => setHighlightedId(null), 1500);
    return () => window.clearTimeout(timer);
  }, [focusId, itemsReady]);

  return { registerNode, highlightedId };
}
