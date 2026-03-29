import { useEffect, useRef, useCallback } from 'react';

interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  edgeOnly?: boolean; // only trigger from screen edge
  edgeWidth?: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 60,
  edgeOnly = false,
  edgeWidth = 30,
}: SwipeOptions) {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (edgeOnly && onSwipeRight && touch.clientX > edgeWidth) return;
    if (edgeOnly && onSwipeLeft && !onSwipeRight && touch.clientX < window.innerWidth - edgeWidth) return;
    touchStart.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }, [edgeOnly, edgeWidth, onSwipeLeft, onSwipeRight]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const elapsed = Date.now() - touchStart.current.time;
    touchStart.current = null;

    // Must be more horizontal than vertical, and within 500ms
    if (Math.abs(dx) < threshold || Math.abs(dy) > Math.abs(dx) * 0.7 || elapsed > 500) return;

    if (dx > 0) onSwipeRight?.();
    else onSwipeLeft?.();
  }, [threshold, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
}
