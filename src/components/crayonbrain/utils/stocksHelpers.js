export const hexToRgb = (hex, fallback = { r: 0, g: 255, b: 255 }) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : fallback;
};

export const smoothToward = (current, target, deltaMs, attackMs = 50, releaseMs = 160) => {
  const rate = target > current ? attackMs : releaseMs;
  const k = 1 - Math.exp(-deltaMs / Math.max(rate, 1));
  return current + (target - current) * k;
};

export const getBarDurationMs = (bpm) => {
  const safeBpm = Number.isFinite(bpm) && bpm > 0 ? bpm : 120;
  return (60000 / safeBpm) * 4;
};

export const getCanvasDrawingSize = (canvas) => {
  if (!canvas) return { width: 0, height: 0, dpr: 1 };

  const width = canvas.clientWidth || 0;
  const height = canvas.clientHeight || 0;
  if (width <= 0 || height <= 0) {
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
