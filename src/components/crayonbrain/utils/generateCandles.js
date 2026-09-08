import {
  BASE_MOVE_FRACTION,
  ENERGY_MOVE_GAIN,
  MOVE_JITTER_MAX,
  MOVE_JITTER_MIN,
  STOCKS_PRESETS,
  STOCKS_START_PRICE,
  WICK_BASE_FRACTION,
  WICK_ENERGY_GAIN,
} from './stocksConstants';

const randRange = ([min, max]) => min + Math.random() * (max - min);
const randInt = (range) => Math.round(randRange(range));

const getPreset = (presetId) => STOCKS_PRESETS[presetId] ?? STOCKS_PRESETS.bull;

export const createTrendState = (presetId, startPrice = STOCKS_START_PRICE) => {
  const preset = getPreset(presetId);
  const dir = preset.primaryDir ?? (Math.random() < 0.5 ? 1 : -1);
  return {
    presetId,
    price: startPrice,
    dir,
    isRetracement: false,
    segmentCandlesLeft: randInt(preset.segmentLenRange),
  };
};

const startNextSegment = (state, preset) => {
  if (preset.primaryDir === null) {
    state.dir = Math.random() < 0.5 ? 1 : -1;
    state.isRetracement = false;
    state.segmentCandlesLeft = randInt(preset.segmentLenRange);
    return;
  }

  if (state.isRetracement) {
    state.dir = preset.primaryDir;
    state.isRetracement = false;
    state.segmentCandlesLeft = randInt(preset.segmentLenRange);
  } else if (Math.random() < preset.retraceChance) {
    state.dir = -preset.primaryDir;
    state.isRetracement = true;
    state.segmentCandlesLeft = randInt(preset.retraceLenRange);
  } else {
    state.dir = preset.primaryDir;
    state.isRetracement = false;
    state.segmentCandlesLeft = randInt(preset.segmentLenRange);
  }
};

export const planNextCandle = (state, energy01 = 0.3) => {
  const preset = getPreset(state.presetId);

  if (state.segmentCandlesLeft <= 0) {
    startNextSegment(state, preset);
  }
  state.segmentCandlesLeft -= 1;

  const withTrend = Math.random() < preset.biasStrength;
  const candleDir = withTrend ? state.dir : -state.dir;

  const jitter = randRange([MOVE_JITTER_MIN, MOVE_JITTER_MAX]);
  const strength = 1 + Math.max(0, Math.min(1, energy01)) * ENERGY_MOVE_GAIN;
  const moveFraction = BASE_MOVE_FRACTION * jitter * strength;

  const open = state.price;
  const close = Math.max(0.01, open + open * moveFraction * candleDir);

  const bodyRange = Math.abs(close - open);
  const wickScale = WICK_BASE_FRACTION + energy01 * WICK_ENERGY_GAIN;
  const wickUp = bodyRange * wickScale * Math.random();
  const wickDown = bodyRange * wickScale * Math.random();

  const high = Math.max(open, close) + wickUp;
  const low = Math.max(0.01, Math.min(open, close) - wickDown);

  state.price = close;

  return { open, close, high, low };
};
