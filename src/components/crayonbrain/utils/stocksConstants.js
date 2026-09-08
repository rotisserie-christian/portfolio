/**
 * Stocks — a dark-mode candlestick chart that "trades" itself. There is no
 * real market data: a small procedural generator produces a synthetic OHLC
 * series (a biased random walk with periodic retracements or, in Chaos mode,
 * randomly-timed regime flips) and the canvas renders it like a terminal
 * ticker.
 *
 * BPM controls how fast candles form (one candle every BEATS_PER_CANDLE
 * beats); the live FFT spectrum controls how hard each candle pushes with
 * (or against) the current trend and how ragged its wicks are.
 */
import { CRT_SCANLINE_ALPHA, CRT_VIGNETTE_CHART } from './stocksCrt';

/** Beats per candle — how many beats it takes to fully form one candle.
 *  0.5 = a new candle every eighth note, i.e. two candles per beat. */
export const BEATS_PER_CANDLE = 0.5;

/** Visible candle slots (finalized candles + the one currently forming). */
export const VISIBLE_CANDLES = 46;
/** History kept beyond the visible window so the ring never runs dry. */
export const MAX_HISTORY_CANDLES = VISIBLE_CANDLES + 8;

/** Fraction of each candle "slot" width occupied by the body (rest is gutter). */
export const CANDLE_BODY_FRACTION = 0.62;
/** Minimum body height in px so flat (open≈close) candles stay visible as a hairline. */
export const MIN_BODY_PX = 1.5;

/** Empty margin reserved on each side of the chart, as a fraction of canvas width. */
export const HORIZONTAL_PADDING_FRACTION = 0.035;

/** Vertical padding above/below the visible price range, as a fraction of that range. */
export const PRICE_PADDING_FRACTION = 0.14;
/** Attack/release (ms) for easing the price axis toward its new min/max. */
export const AXIS_ATTACK_MS = 500;
export const AXIS_RELEASE_MS = 900;

/* ---- Trend generator ------------------------------------------------------ */

/** Base per-candle magnitude as a fraction of the current price. */
export const BASE_MOVE_FRACTION = 0.012;
/** How much the live audio energy envelope can amplify a candle's move
 *  (this is the "strength of ascent/descent" driven by playback complexity). */
export const ENERGY_MOVE_GAIN = 2.4;
/** Random jitter multiplier range applied to each candle's magnitude. */
export const MOVE_JITTER_MIN = 0.55;
export const MOVE_JITTER_MAX = 1.35;

/** Wick overshoot beyond the body, as a fraction of the body's magnitude. */
export const WICK_BASE_FRACTION = 0.35;
export const WICK_ENERGY_GAIN = 0.9;

/** Attack/release (ms) for the smoothed energy envelope driving candle strength. */
export const ENERGY_ATTACK_MS = 80;
export const ENERGY_RELEASE_MS = 320;

export const STOCKS_PRESETS = {
  bull: {
    label: 'Bull Trend',
    primaryDir: 1,
    biasStrength: 0.74,
    segmentLenRange: [5, 11],
    retraceChance: 0.65,
    retraceLenRange: [2, 5],
  },
  bear: {
    label: 'Bear Trend',
    primaryDir: -1,
    biasStrength: 0.74,
    segmentLenRange: [5, 11],
    retraceChance: 0.65,
    retraceLenRange: [2, 5],
  },
  chaos: {
    label: 'Chaos',
    primaryDir: null,
    biasStrength: 0.68,
    segmentLenRange: [3, 8],
    retraceChance: 0,
    retraceLenRange: [0, 0],
  },
};

export const STOCKS_PRESET_IDS = ['bull', 'bear', 'chaos'];
export const DEFAULT_STOCKS_PRESET = 'bull';
export const STOCKS_START_PRICE = 100;

/* ---- Dark-mode terminal palette -------------------------------------------- */

export const STOCKS_BG = '#0a0d12';
export const STOCKS_UP_COLOR = '#2ee6a6';
export const STOCKS_DOWN_COLOR = '#ff5c72';
/** Alpha for the still-forming (rightmost) candle — reads as "live". */
export const STOCKS_PENDING_ALPHA = 0.78;
export const STOCKS_FINAL_ALPHA = 0.95;

/* ---- Pattern flashes ------------------------------------------------------- */

/** How long trendlines stay on screen after a pattern prints. */
export const PATTERN_FLASH_MS = 500;
/** Closed candles to skip after a flash so the same setup does not retrigger. */
export const PATTERN_COOLDOWN_CANDLES = 10;
/** Window scanned for wedge/flag/triangle setups. */
export const PATTERN_LOOKBACK = 18;
export const PATTERN_LINE_COLOR = '#f4e4a6';
export const PATTERN_LINE_WIDTH = 1.5;

/** CRT overlay — chart-friendly (corner kiss only; no grain/flicker noise). */
export const STOCKS_CRT_OPTIONS = {
  vignette: CRT_VIGNETTE_CHART,
  scanlineAlpha: CRT_SCANLINE_ALPHA,
  grain: false,
  flicker: false,
};
