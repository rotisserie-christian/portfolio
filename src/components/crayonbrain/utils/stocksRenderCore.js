import { smoothToward, getBarDurationMs } from './stocksHelpers';
import { createTrendState, planNextCandle } from './generateCandles';
import { detectChartPattern } from './detectChartPatterns';
import { drawStocksFrame } from './drawCandles';
import {
  AXIS_ATTACK_MS,
  AXIS_RELEASE_MS,
  BEATS_PER_CANDLE,
  DEFAULT_STOCKS_PRESET,
  ENERGY_ATTACK_MS,
  ENERGY_RELEASE_MS,
  MAX_HISTORY_CANDLES,
  PATTERN_COOLDOWN_CANDLES,
  PATTERN_FLASH_MS,
  PRICE_PADDING_FRACTION,
  STOCKS_START_PRICE,
  VISIBLE_CANDLES,
} from './stocksConstants';

const lerp = (a, b, t) => a + (b - a) * t;

export const createStocksRenderer = ({
  canvas,
  mode = DEFAULT_STOCKS_PRESET,
  bpm = 120,
}) => {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    return { ready: false, dispose: () => {}, renderFrame: () => {} };
  }

  let energyEnv = 0.3;
  let trendState = createTrendState(mode, STOCKS_START_PRICE);
  let history = [];
  let pending = planNextCandle(trendState, energyEnv);
  let elapsedMs = 0;
  let lastCandleIndex = 0;
  let minPrice = pending.low;
  let maxPrice = pending.high;
  let currentBpm = bpm;
  let currentMode = mode;
  let patternOverlays = [];
  let patternCooldown = 0;

  const pushOverlay = (geometry) => {
    if (!geometry) return;
    patternOverlays.push({ ...geometry, startMs: elapsedMs });
    patternCooldown = PATTERN_COOLDOWN_CANDLES;
  };

  const noteClosedCandle = () => {
    if (patternCooldown > 0) {
      patternCooldown -= 1;
      return;
    }
    pushOverlay(detectChartPattern(history));
  };

  const resetState = (nextMode = currentMode, nextBpm = currentBpm) => {
    currentMode = nextMode;
    currentBpm = nextBpm;
    energyEnv = 0.3;
    trendState = createTrendState(currentMode, STOCKS_START_PRICE);
    history = [];
    pending = planNextCandle(trendState, energyEnv);
    elapsedMs = 0;
    lastCandleIndex = 0;
    minPrice = pending.low;
    maxPrice = pending.high;
    patternOverlays = [];
    patternCooldown = 0;
  };

  const setBpm = (nextBpm) => {
    if (Number.isFinite(nextBpm) && nextBpm > 0) currentBpm = nextBpm;
  };

  const renderFrame = ({
    energy = 0.3,
    deltaMs = 16.67,
    isPlaying = true,
    width = canvas.width,
    height = canvas.height,
  }) => {
    if (width <= 0 || height <= 0) return;

    const dpr = canvas.width / width;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const instEnergy = Number.isFinite(energy) ? energy : 0.3;
    energyEnv = smoothToward(energyEnv, instEnergy, deltaMs, ENERGY_ATTACK_MS, ENERGY_RELEASE_MS);

    if (isPlaying) {
      elapsedMs += deltaMs;
    }

    const candleDurationMs = (getBarDurationMs(currentBpm) / 4) * BEATS_PER_CANDLE;
    const candleIndex = Math.floor(elapsedMs / candleDurationMs);
    let toFinalize = candleIndex - lastCandleIndex;
    if (toFinalize > MAX_HISTORY_CANDLES) toFinalize = MAX_HISTORY_CANDLES;

    for (let i = 0; i < toFinalize; i++) {
      history.push(pending);
      noteClosedCandle();
      pending = planNextCandle(trendState, energyEnv);
    }
    if (history.length > MAX_HISTORY_CANDLES) {
      history = history.slice(-MAX_HISTORY_CANDLES);
    }
    lastCandleIndex = candleIndex;

    patternOverlays = patternOverlays.filter(
      (overlay) => elapsedMs - overlay.startMs < PATTERN_FLASH_MS
    );

    const progress = Math.min(1, (elapsedMs % candleDurationMs) / candleDurationMs);
    const jitterAmp =
      Math.abs(pending.high - pending.low) * 0.15 * Math.abs(instEnergy - energyEnv);
    const growingCandle = {
      open: pending.open,
      close: lerp(pending.open, pending.close, progress),
      high: lerp(pending.open, pending.high, progress) + jitterAmp,
      low: lerp(pending.open, pending.low, progress) - jitterAmp,
    };

    const visibleHistory = history.slice(-(VISIBLE_CANDLES - 1));

    let rawMin = growingCandle.low;
    let rawMax = growingCandle.high;
    for (const c of visibleHistory) {
      if (c.low < rawMin) rawMin = c.low;
      if (c.high > rawMax) rawMax = c.high;
    }
    const pad = (rawMax - rawMin) * PRICE_PADDING_FRACTION || 1;
    minPrice = smoothToward(minPrice, rawMin - pad, deltaMs, AXIS_ATTACK_MS, AXIS_RELEASE_MS);
    maxPrice = smoothToward(maxPrice, rawMax + pad, deltaMs, AXIS_ATTACK_MS, AXIS_RELEASE_MS);

    drawStocksFrame(ctx, {
      width,
      height,
      candles: visibleHistory,
      pendingCandle: growingCandle,
      minPrice,
      maxPrice,
      patternOverlays,
      elapsedMs,
    });
  };

  return {
    ready: true,
    resetState,
    setBpm,
    renderFrame,
    dispose: () => {},
  };
};
