import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

interface UseDraggableOptions {
  onChange: (x: number, y: number) => void;
  disabled?: boolean;
}

interface DragState {
  pointerId: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

/**
 * Dependency-free pointer drag for a fixed-position element. Computes the new
 * top/left from the element's live rect (works whether it starts from a CSS
 * corner or an explicit position), clamps to the viewport, and ignores drags
 * that begin on interactive controls.
 */
export function useDraggable({ onChange, disabled }: UseDraggableOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<DragState | null>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (disabled) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, [data-no-drag]")) return;

    const rect = event.currentTarget.getBoundingClientRect();
    dragState.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;

    const maxX = Math.max(0, window.innerWidth - state.width);
    const maxY = Math.max(0, window.innerHeight - state.height);
    const x = Math.min(Math.max(0, event.clientX - state.offsetX), maxX);
    const y = Math.min(Math.max(0, event.clientY - state.offsetY), maxY);
    onChange(x, y);
  };

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const state = dragState.current;
    if (!state || state.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragState.current = null;
    setIsDragging(false);
  };

  return {
    isDragging,
    handleProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
