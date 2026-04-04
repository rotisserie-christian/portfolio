import { useEffect, useRef } from 'react';

/**
 * Manages a requestAnimationFrame render loop
 * 
 * @param renderCallback - Function to call on each frame
 * @param isActive - Whether the loop should be running (default: true)
 */
export const useRenderLoop = (renderCallback: () => void, isActive: boolean = true): void => {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const render = () => {
      try {
        renderCallback();
      } catch (err) {
        if (import.meta?.env?.MODE === 'development') {
          console.warn('render loop error', err);
        }
      }
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [renderCallback, isActive]);
};
