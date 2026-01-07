import { useEffect } from 'react';

/**
 * Handle canvas resize with ResizeObserver
 * @param {React.RefObject} canvasRef - Reference to canvas element
 * @param {Function} onResize - Callback function when resize occurs
 */
export const useCanvasResize = (canvasRef, onResize) => {
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
    
    const resizeObserver = new ResizeObserver(updateCanvas);
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasRef, onResize]);
};

