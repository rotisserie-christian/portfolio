import { PATTERN_LOOKBACK } from './stocksConstants';

const SWING_RADIUS = 2;
const MIN_SPAN = 6;
const PARALLEL_SLOPE_RATIO = 0.22;
const CONVERGE_RATIO = 0.8;
const MAX_FIT_ERR_FRACTION = 0.22;

const fitLine = (points) => {
  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (const p of points) {
    sumX += p.i;
    sumY += p.price;
    sumXY += p.i * p.price;
    sumXX += p.i * p.i;
  }
  const denom = n * sumXX - sumX * sumX;
  const slope = Math.abs(denom) < 1e-9 ? 0 : (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return {
    at: (i) => intercept + slope * i,
  };
};

const maxAbsErr = (points, line) => {
  let max = 0;
  for (const p of points) {
    const err = Math.abs(p.price - line.at(p.i));
    if (err > max) max = err;
  }
  return max;
};

const collectSwings = (candles, offset) => {
  const highs = [];
  const lows = [];
  const last = candles.length - SWING_RADIUS;
  for (let i = SWING_RADIUS; i < last; i++) {
    let isHigh = true;
    let isLow = true;
    for (let d = 1; d <= SWING_RADIUS; d++) {
      if (candles[i].high < candles[i - d].high || candles[i].high < candles[i + d].high) {
        isHigh = false;
      }
      if (candles[i].low > candles[i - d].low || candles[i].low > candles[i + d].low) {
        isLow = false;
      }
    }
    if (isHigh) highs.push({ i: offset + i, price: candles[i].high });
    if (isLow) lows.push({ i: offset + i, price: candles[i].low });
  }
  return { highs, lows };
};

export const detectChartPattern = (history) => {
  if (!history || history.length < PATTERN_LOOKBACK) return null;

  const offset = history.length - PATTERN_LOOKBACK;
  const slice = history.slice(offset);
  const { highs, lows } = collectSwings(slice, offset);
  if (highs.length < 2 || lows.length < 2) return null;

  const recentHighs = highs.slice(-3);
  const recentLows = lows.slice(-3);
  const newestIdx = history.length - 1;
  if (Math.max(recentHighs[recentHighs.length - 1].i, recentLows[recentLows.length - 1].i) < newestIdx - 2) {
    return null;
  }

  const upper = fitLine(recentHighs);
  const lower = fitLine(recentLows);
  const i0 = Math.min(recentHighs[0].i, recentLows[0].i);
  const i1 = Math.max(recentHighs[recentHighs.length - 1].i, recentLows[recentLows.length - 1].i);
  const span = i1 - i0;
  if (span < MIN_SPAN) return null;

  const u0 = upper.at(i0);
  const u1 = upper.at(i1);
  const l0 = lower.at(i0);
  const l1 = lower.at(i1);
  if (u0 <= l0 || u1 <= l1) return null;

  const startW = u0 - l0;
  const endW = u1 - l1;
  const scale = Math.max(startW, 1e-6);
  if (maxAbsErr(recentHighs, upper) > scale * MAX_FIT_ERR_FRACTION) return null;
  if (maxAbsErr(recentLows, lower) > scale * MAX_FIT_ERR_FRACTION) return null;

  const uSlope = (u1 - u0) / span;
  const lSlope = (l1 - l0) / span;
  const slopeScale = Math.max(Math.abs(uSlope), Math.abs(lSlope), scale / span);
  const parallel = Math.abs(uSlope - lSlope) <= slopeScale * PARALLEL_SLOPE_RATIO;
  const converging = endW < startW * CONVERGE_RATIO;
  if (!parallel && !converging) return null;

  return toOverlay(history.length, [
    { i: i0, price: u0 },
    { i: i1, price: u1 },
  ], [
    { i: i0, price: l0 },
    { i: i1, price: l1 },
  ]);
};

const toOverlay = (historyLen, upper, lower) => ({
  upper: upper.map((p) => ({ back: historyLen - 1 - p.i, price: p.price })),
  lower: lower.map((p) => ({ back: historyLen - 1 - p.i, price: p.price })),
});
