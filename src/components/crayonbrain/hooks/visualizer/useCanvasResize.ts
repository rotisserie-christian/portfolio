import { useEffect, RefObject } from 'react';

export interface ResizeInfo {
  width: number;
  height: number;
  dpr: number;
}

/**
 * Handles canvas sizing with device pixel ratio and window resize events
 * 
 * @param canvasRef - React ref to the canvas element
 * @param onResize - Optional callback when canvas is resized, receives { width, height, dpr }
 */
export const useCanvasResize = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  onResize?: (info: ResizeInfo) => void
): void => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      
      canvas.width = width;
      canvas.height = height;
      
      // Call optional callback with resize info
      if (onResize) {
        onResize({ width, height, dpr });
      }
    };
    
    // Initial resize
    resize();
    
    // Listen for window resize events
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, onResize]);
};
