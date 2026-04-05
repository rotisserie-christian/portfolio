import { useEffect, RefObject } from 'react';

/**
 * Handle canvas resize with ResizeObserver
 * @param {RefObject<HTMLCanvasElement | null>} canvasRef - Reference to canvas element
 * @param {(width: number, height: number) => void} onResize - Callback function when resize occurs
 */
export const useCanvasResize = (
  canvasRef: RefObject<HTMLCanvasElement | null>, 
  onResize: (width: number, height: number) => void
): void => {
  useEffect(() => {
    const updateCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      onResize(width, height);
    };

    updateCanvas(); // Initial setup
    
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const resizeObserver = new ResizeObserver(updateCanvas);
      resizeObserver.observe(canvasElement);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [canvasRef, onResize]);
};
