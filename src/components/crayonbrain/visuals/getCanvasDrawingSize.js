/**
 * CSS-pixel drawing size for a canvas whose buffer may be DPR-scaled
 * (including when DPR is capped below window.devicePixelRatio).
 *
 * Prefer clientWidth/Height so callers never divide buffer size by the raw
 * devicePixelRatio and undersize the draw when maxDpr is applied.
 *
 * @param {HTMLCanvasElement | null | undefined} canvas
 * @returns {{ width: number, height: number, dpr: number }}
 */
export const getCanvasDrawingSize = (canvas) => {
  if (!canvas) return { width: 0, height: 0, dpr: 1 };

  const width = canvas.clientWidth || 0;
  const height = canvas.clientHeight || 0;
  if (width <= 0 || height <= 0) {
    // Before layout: treat the buffer as 1:1 CSS pixels.
    return {
      width: canvas.width || 0,
      height: canvas.height || 0,
      dpr: 1,
    };
  }

  return {
    width,
    height,
    dpr: canvas.width > 0 ? canvas.width / width : 1,
  };
};
