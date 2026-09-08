import { applyCrtOverlay } from './stocksCrt';
import { hexToRgb } from './stocksHelpers';
import {
  CANDLE_BODY_FRACTION,
  HORIZONTAL_PADDING_FRACTION,
  MIN_BODY_PX,
  PATTERN_FLASH_MS,
  PATTERN_LINE_COLOR,
  PATTERN_LINE_WIDTH,
  STOCKS_BG,
  STOCKS_CRT_OPTIONS,
  STOCKS_DOWN_COLOR,
  STOCKS_FINAL_ALPHA,
  STOCKS_PENDING_ALPHA,
  STOCKS_UP_COLOR,
  VISIBLE_CANDLES,
} from './stocksConstants';

const UP_RGB = hexToRgb(STOCKS_UP_COLOR, { r: 46, g: 230, b: 166 });
const DOWN_RGB = hexToRgb(STOCKS_DOWN_COLOR, { r: 46, g: 230, b: 166 });

const drawTrendline = (ctx, points, sidePadding, startSlot, slotWidth, candlesLen, yFor, alpha) => {
  if (!points || points.length < 2) return;
  ctx.beginPath();
  let started = false;
  for (const p of points) {
    const idx = candlesLen - 1 - p.back;
    if (idx < 0 || idx >= candlesLen) continue;
    const cx = sidePadding + (startSlot + idx + 0.5) * slotWidth;
    const cy = yFor(p.price);
    if (!started) {
      ctx.moveTo(cx, cy);
      started = true;
    } else {
      ctx.lineTo(cx, cy);
    }
  }
  if (!started) return;
  ctx.strokeStyle = PATTERN_LINE_COLOR;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = PATTERN_LINE_WIDTH;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.globalAlpha = 1;
};

const drawCandle = (ctx, cx, slotWidth, candle, yFor, alpha) => {
  const isUp = candle.close >= candle.open;
  const rgb = isUp ? UP_RGB : DOWN_RGB;
  const color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  const bodyWidth = Math.max(1, slotWidth * CANDLE_BODY_FRACTION);

  const yHigh = yFor(candle.high);
  const yLow = yFor(candle.low);
  const yOpen = yFor(candle.open);
  const yClose = yFor(candle.close);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, yHigh);
  ctx.lineTo(cx, yLow);
  ctx.stroke();

  const bodyTop = Math.min(yOpen, yClose);
  const bodyHeight = Math.max(MIN_BODY_PX, Math.abs(yClose - yOpen));
  ctx.fillStyle = color;
  ctx.fillRect(cx - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
};

export const drawStocksFrame = (
  ctx,
  {
    width,
    height,
    candles,
    pendingCandle,
    minPrice,
    maxPrice,
    patternOverlays = [],
    elapsedMs = 0,
  }
) => {
  ctx.fillStyle = STOCKS_BG;
  ctx.fillRect(0, 0, width, height);

  const span = Math.max(1e-6, maxPrice - minPrice);
  const yFor = (price) => height - ((price - minPrice) / span) * height;

  const sidePadding = width * HORIZONTAL_PADDING_FRACTION;
  const chartWidth = Math.max(1, width - sidePadding * 2);
  const slotWidth = chartWidth / VISIBLE_CANDLES;
  const totalSlots = candles.length + (pendingCandle ? 1 : 0);
  const startSlot = VISIBLE_CANDLES - totalSlots;

  for (let i = 0; i < candles.length; i++) {
    const cx = sidePadding + (startSlot + i + 0.5) * slotWidth;
    drawCandle(ctx, cx, slotWidth, candles[i], yFor, STOCKS_FINAL_ALPHA);
  }

  if (pendingCandle) {
    const cx = sidePadding + (startSlot + candles.length + 0.5) * slotWidth;
    drawCandle(ctx, cx, slotWidth, pendingCandle, yFor, STOCKS_PENDING_ALPHA);
  }

  for (const overlay of patternOverlays) {
    const age = elapsedMs - overlay.startMs;
    const alpha = Math.max(0, 1 - age / PATTERN_FLASH_MS);
    if (alpha <= 0) continue;
    drawTrendline(ctx, overlay.upper, sidePadding, startSlot, slotWidth, candles.length, yFor, alpha);
    drawTrendline(ctx, overlay.lower, sidePadding, startSlot, slotWidth, candles.length, yFor, alpha);
  }

  applyCrtOverlay(ctx, width, height, STOCKS_CRT_OPTIONS);
};
