export const CRT_SCANLINE_ALPHA = 0.11;
export const CRT_SCAN_PERIOD_PX = 3;
export const CRT_SCAN_LINE_FRACTION = 0.38;

export const CRT_VIGNETTE_CHART = {
  innerStop: 0.55,
  midStop: 0.88,
  midAlpha: 0.07,
  outerAlpha: 0.16,
  ellipseScaleX: 1.55,
  ellipseScaleY: 1.55,
};

const drawCrtVignetteRadial = (ctx, width, height, options) => {
  const { innerStop, midStop, midAlpha, outerAlpha, ellipseScaleX, ellipseScaleY } = options;
  const cx = width / 2;
  const cy = height / 2;
  const rx = Math.max(1, cx * ellipseScaleX);
  const ry = Math.max(1, cy * ellipseScaleY);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(rx, ry);
  const vignette = ctx.createRadialGradient(0, 0, innerStop, 0, 0, 1);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(Math.min(0.999, midStop), `rgba(0, 0, 0, ${midAlpha})`);
  vignette.addColorStop(1, `rgba(0, 0, 0, ${outerAlpha})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(-1.05, -1.05, 2.1, 2.1);
  ctx.restore();
};

const drawCrtScanlines = (ctx, width, height, alpha = CRT_SCANLINE_ALPHA, periodPx = CRT_SCAN_PERIOD_PX) => {
  const period = Math.max(2, periodPx);
  const lineH = Math.max(0.75, period * CRT_SCAN_LINE_FRACTION);
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  for (let y = 0; y < height; y += period) {
    ctx.fillRect(0, y, width, lineH);
  }
};

export const applyCrtOverlay = (ctx, width, height, options = {}) => {
  const {
    vignette = CRT_VIGNETTE_CHART,
    scanlineAlpha = CRT_SCANLINE_ALPHA,
    scanPeriodPx = CRT_SCAN_PERIOD_PX,
  } = options;

  drawCrtVignetteRadial(ctx, width, height, vignette);
  drawCrtScanlines(ctx, width, height, scanlineAlpha, scanPeriodPx);
};
