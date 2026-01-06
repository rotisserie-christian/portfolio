import { useEffect } from 'react';

/**
 * Handles canvas sizing with device pixel ratio and window resize events
 * 
 * @param {Object} canvasRef - React ref to the canvas element
 * @param {Function} onResize - Optional callback when canvas is resized, receives { width, height, dpr }
 * @returns {Object} Canvas dimensions and DPR
 * @returns {number} returns.width - Canvas width in pixels
 * @returns {number} returns.height - Canvas height in pixels
 * @returns {number} returns.dpr - Device pixel ratio
 */
export const useCanvasResize = (canvasRef, onResize) => {
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

