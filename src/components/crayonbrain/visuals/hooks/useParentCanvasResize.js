import { useEffect } from 'react';
const MAX_DEVICE_PIXEL_RATIO = 2;

/**
 * Size canvas to parent with devicePixelRatio (ResizeObserver + window resize).
 * Defaults to capping DPR at MAX_DEVICE_PIXEL_RATIO (same as Butterchurn preview)
 * so Retina phones don't get 3× buffers. Pass maxDpr explicitly to override.
 */
export const useParentCanvasResize = (
  canvasRef,
  { enabled = true, minHeight = 5, maxDpr = MAX_DEVICE_PIXEL_RATIO } = {}
) => {
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const applySize = () => {
      const rawDpr = window.devicePixelRatio || 1;
      const dpr = maxDpr != null ? Math.min(rawDpr, maxDpr) : rawDpr;
      const rect = canvas.getBoundingClientRect();
      let displayWidth = Math.floor(rect.width);
      let displayHeight = Math.floor(rect.height);

      // Before layout, fall back to the positioned parent (e.g. absolute inset-0 slot).
      if (displayHeight < minHeight && canvas.parentElement) {
        displayWidth = canvas.parentElement.clientWidth;
        displayHeight = canvas.parentElement.clientHeight;
      }
      if (displayHeight < minHeight) return null;

      const width = Math.floor(displayWidth * dpr);
      const height = Math.floor(displayHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      return { width, height, dpr, displayWidth, displayHeight };
    };

    const resizeObserver = new ResizeObserver(() => applySize());
    resizeObserver.observe(canvas);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    applySize();
    window.addEventListener('resize', applySize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', applySize);
    };
  }, [canvasRef, enabled, minHeight, maxDpr]);
};
