export const smoothToward = (current, target, deltaMs, attackMs = 50, releaseMs = 160) => {
  const rate = target > current ? attackMs : releaseMs;
  const k = 1 - Math.exp(-deltaMs / Math.max(rate, 1));
  return current + (target - current) * k;
};

/** Log-spaced FFT groups uploaded to shape shaders as separate uniforms. */
export const SHADER_FFT_BANDS = 8;

/** Fraction of analyser bins kept. The top of the FFT is mostly empty air. */
const FFT_BAND_USABLE = 0.62;

const WAVE_NAMES = ['sine', 'triangle', 'square', 'saw'];

/** Peak-normalized cycle features for a clean oscillator. */
const WAVE_FEATURE_TARGETS = {
  sine: { flat: 0.28, crest: 1.414, oneWay: 0.12 },
  triangle: { flat: 0.08, crest: 1.732, oneWay: 0.1 },
  square: { flat: 0.9, crest: 1.02, oneWay: 0.2 },
  saw: { flat: 0.1, crest: 1.732, oneWay: 0.82 },
};

const WAVE_FEATURE_SCALE = { flat: 1.6, crest: 1.15, oneWay: 1.45 };

/** How sharply a close waveform wins. */
const WAVE_SOFTMAX_TEMP = 0.045;

const sineShape = () => ({ sine: 1, triangle: 0, square: 0, saw: 0 });

const centerTimeDomain = (timeData) => {
  const n = timeData.length;
  const samples = new Float64Array(n);
  let mean = 0;
  for (let i = 0; i < n; i++) {
    samples[i] = (timeData[i] - 128) / 128;
    mean += samples[i];
  }
  mean /= n;
  let energy = 0;
  for (let i = 0; i < n; i++) {
    samples[i] -= mean;
    energy += samples[i] * samples[i];
  }
  return { samples, rms: Math.sqrt(energy / n) };
};

const correlation = (samples, lag) => {
  const end = samples.length - lag;
  let dot = 0;
  for (let i = 0; i < end; i++) dot += samples[i] * samples[i + lag];
  return dot / end;
};

/** Lags whose correlation is a local peak, shortest strong one first. */
const firstStrongPeak = (samples, minLag, maxLag) => {
  const n = samples.length;
  let energy = 0;
  for (let i = 0; i < n; i++) energy += samples[i] * samples[i];
  if (energy < 1e-6 || maxLag <= minLag + 1) return 0;

  const meanSq = energy / n;
  const corr = new Float64Array(maxLag + 1);
  for (let lag = minLag; lag <= maxLag; lag++) corr[lag] = correlation(samples, lag);

  const peaks = [];
  for (let lag = minLag + 1; lag < maxLag; lag++) {
    if (corr[lag] >= corr[lag - 1] && corr[lag] > corr[lag + 1]) peaks.push(lag);
  }
  if (!peaks.length) return 0;

  let best = 0;
  for (const lag of peaks) best = Math.max(best, corr[lag]);
  if (best / meanSq < 0.45) return 0;

  const gate = best * 0.88;
  for (const lag of peaks) {
    if (corr[lag] >= gate) return lag;
  }
  return 0;
};

/** Period in samples. 0 when the buffer is not a repeating wave. */
const findWavePeriod = (samples) => {
  const n = samples.length;
  if (n < 32) return 0;
  const decimate = n > 700 ? 4 : 1;
  if (decimate === 1) return firstStrongPeak(samples, 6, Math.floor(n / 2));

  const coarseLength = Math.floor(n / decimate);
  const coarse = new Float64Array(coarseLength);
  for (let i = 0; i < coarseLength; i++) {
    let sum = 0;
    const start = i * decimate;
    for (let k = 0; k < decimate; k++) sum += samples[start + k];
    coarse[i] = sum / decimate;
  }
  const coarsePeriod = firstStrongPeak(coarse, 2, Math.floor(coarseLength / 2));
  if (!coarsePeriod) return 0;

  const guess = coarsePeriod * decimate;
  const minLag = Math.max(6, guess - decimate);
  const maxLag = Math.min(Math.floor(n / 2) - 1, guess + decimate);
  return firstStrongPeak(samples, minLag, maxLag) || guess;
};

const foldWaveCycle = (samples, period) => {
  const bins = 64;
  const cycle = new Float64Array(bins);
  const weight = new Float64Array(bins);
  const cycles = Math.max(1, Math.floor(samples.length / period));
  const use = Math.min(cycles, 12);
  for (let c = 0; c < use; c++) {
    const start = c * period;
    for (let i = 0; i < period; i++) {
      const bin = Math.min(bins - 1, Math.floor((i * bins) / period));
      cycle[bin] += samples[start + i];
      weight[bin] += 1;
    }
  }
  let peak = 0;
  for (let i = 0; i < bins; i++) {
    cycle[i] = weight[i] ? cycle[i] / weight[i] : 0;
    peak = Math.max(peak, Math.abs(cycle[i]));
  }
  if (peak < 1e-6) return null;
  for (let i = 0; i < bins; i++) cycle[i] /= peak;
  return cycle;
};

const cycleFeatures = (cycle) => {
  const n = cycle.length;
  let flat = 0;
  let sumSq = 0;
  for (let i = 0; i < n; i++) {
    const value = cycle[i];
    sumSq += value * value;
    if (Math.abs(value) > 0.9) flat += 1;
  }
  const rms = Math.sqrt(sumSq / n);
  const crest = rms > 1e-6 ? 1 / rms : 1;

  let maxDiff = 0;
  const diffs = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    diffs[i] = cycle[(i + 1) % n] - cycle[i];
    maxDiff = Math.max(maxDiff, Math.abs(diffs[i]));
  }
  const slopeCut = maxDiff * 0.35;
  let pos = 0;
  let neg = 0;
  for (let i = 0; i < n; i++) {
    const diff = diffs[i];
    if (Math.abs(diff) < slopeCut) continue;
    if (diff > 0) pos += 1;
    else neg += 1;
  }
  const slopes = pos + neg;
  const oneWay = slopes > 0 ? Math.abs(pos - neg) / slopes : 0;
  return { flat: flat / n, crest, oneWay };
};

const weightsFromCycle = (features) => {
  const distances = {};
  let closest = Infinity;
  for (const name of WAVE_NAMES) {
    const target = WAVE_FEATURE_TARGETS[name];
    const distance = WAVE_FEATURE_SCALE.flat * (features.flat - target.flat) ** 2
      + WAVE_FEATURE_SCALE.crest * (features.crest - target.crest) ** 2
      + WAVE_FEATURE_SCALE.oneWay * (features.oneWay - target.oneWay) ** 2;
    distances[name] = distance;
    closest = Math.min(closest, distance);
  }

  let scoreSum = 0;
  const weights = {};
  for (const name of WAVE_NAMES) {
    const score = Math.exp(-(distances[name] - closest) / WAVE_SOFTMAX_TEMP);
    weights[name] = score;
    scoreSum += score;
  }
  for (const name of WAVE_NAMES) weights[name] /= scoreSum;

  const miss = Math.min(1, Math.max(0, (closest - 0.12) / 0.28));
  if (miss > 0) {
    for (const name of WAVE_NAMES) weights[name] *= 1 - miss;
    weights.sine += miss;
  }
  return weights;
};

const buildFftBandEdges = (length, bandCount) => {
  const maxBin = Math.min(length, Math.max(bandCount * 2, Math.floor(length * FFT_BAND_USABLE)));
  const logMax = Math.log(maxBin);
  const edges = new Array(bandCount + 1);
  edges[0] = 1;
  for (let b = 1; b <= bandCount; b++) {
    const logEdge = Math.floor(Math.exp(logMax * (b / bandCount)));
    edges[b] = Math.max(logEdge, edges[b - 1] + 2);
  }
  edges[bandCount] = Math.min(length, Math.max(edges[bandCount - 1] + 1, maxBin));
  return edges;
};

/**
 * Peak level of each log-spaced FFT group, 0..1.
 * Peaks (not means) so a hit in one bin is not diluted by the quiet bins
 * around it. Band 0 is the lowest group, the last band is the highest.
 * Levels are left linear; `resolveShapeBandDrives` turns them into contrast.
 *
 * @param {ArrayLike<number>} audioData byte frequency data, 0..255
 * @param {number} [bandCount]
 * @returns {number[]}
 */
export const extractFftBands = (audioData, bandCount = SHADER_FFT_BANDS) => {
  const bands = new Array(bandCount).fill(0);
  const len = audioData?.length ?? 0;
  if (len < 2 || bandCount < 1) return bands;

  const edges = buildFftBandEdges(len, bandCount);

  for (let b = 0; b < bandCount; b++) {
    const i0 = Math.min(edges[b], len - 1);
    const i1 = Math.min(len, Math.max(i0 + 1, edges[b + 1]));
    let peak = 0;
    for (let i = i0; i < i1; i++) {
      if (audioData[i] > peak) peak = audioData[i];
    }
    bands[b] = peak / 255;
  }
  return bands;
};

/**
 * Scope figure for one analyser time-domain buffer (0..255, 128 is silence).
 * A repeating sine, triangle, square, or saw becomes that figure. Silence
 * and a buffer with no clear period stay a sine, which the rings draw as a circle.
 *
 * @param {ArrayLike<number>} timeData `getByteTimeDomainData` bytes
 * @returns {{ sine: number, triangle: number, square: number, saw: number }}
 */
export const classifyWaveform = (timeData) => {
  const len = timeData?.length ?? 0;
  if (len < 32) return sineShape();

  const { samples, rms } = centerTimeDomain(timeData);
  if (rms < 0.04) return sineShape();

  const period = findWavePeriod(samples);
  if (period < 8) return sineShape();

  const cycle = foldWaveCycle(samples, period);
  if (!cycle) return sineShape();
  return weightsFromCycle(cycleFeatures(cycle));
};

const BAND_NOISE_FLOOR = 0.05;
const BAND_GATE_WIDTH = 0.1;
const BAND_CONTRAST_POWER = 1.85;
const BAND_ONSET_GAIN = 5;

/**
 * Turn raw band levels into 0..1 drives for the shape shaders.
 * The loudest band wins, so a full mix does not pin every ring at 1.
 * A band rising above its slow baseline flashes even when it is not the loudest.
 *
 * @param {ArrayLike<number>} fastBands
 * @param {ArrayLike<number>} baseBands
 * @returns {number[]}
 */
const shapeBandGate = (fastBands) => {
  let peak = 0;
  for (let i = 0; i < fastBands.length; i++) {
    if (fastBands[i] > peak) peak = fastBands[i];
  }
  const gate = peak <= BAND_NOISE_FLOOR
    ? 0
    : Math.min(1, (peak - BAND_NOISE_FLOOR) / BAND_GATE_WIDTH);
  const peakLift = Math.max(peak - BAND_NOISE_FLOOR, 1e-4);
  return { gate, peakLift };
};

/** How far each band sits above its slow baseline, 0..1. A held note is 0. */
export const resolveShapeBandOnsets = (fastBands, baseBands) => {
  const count = fastBands.length;
  const onsets = new Array(count).fill(0);
  const { gate } = shapeBandGate(fastBands);
  for (let i = 0; i < count; i++) {
    const baseline = baseBands?.[i] ?? 0;
    const onset = Math.min(1, Math.max(0, fastBands[i] - baseline) * BAND_ONSET_GAIN);
    onsets[i] = Math.min(1, onset * gate);
  }
  return onsets;
};

export const resolveShapeBandDrives = (fastBands, baseBands) => {
  const count = fastBands.length;
  const drives = new Array(count).fill(0);
  const { gate, peakLift } = shapeBandGate(fastBands);
  for (let i = 0; i < count; i++) {
    const lifted = Math.max(0, fastBands[i] - BAND_NOISE_FLOOR);
    const relative = Math.pow(Math.min(1, lifted / peakLift), BAND_CONTRAST_POWER);
    const baseline = baseBands?.[i] ?? 0;
    const onset = Math.min(1, Math.max(0, fastBands[i] - baseline) * BAND_ONSET_GAIN);
    drives[i] = Math.min(1, Math.max(relative, onset) * gate);
  }
  return drives;
};

export const extractMathAudioFeatures = (audioData) => {
  const len = audioData.length;
  if (len === 0) {
    return {
      bass: 0,
      treble: 0,
      centroid: 0.5,
      energy: 0,
      brightness: 0.5,
      bands: extractFftBands(audioData),
    };
  }

  const bassEnd = Math.max(1, Math.floor(len * 0.1));
  const trebleStart = Math.floor(len * 0.2);
  const trebleEnd = Math.floor(len * 0.6);

  let bassSum = 0;
  for (let i = 0; i < bassEnd; i++) bassSum += audioData[i];
  const bass = (bassSum / bassEnd) / 255;

  let trebleSum = 0;
  const trebleCount = Math.max(1, trebleEnd - trebleStart);
  for (let i = trebleStart; i < trebleEnd; i++) trebleSum += audioData[i];
  const treble = (trebleSum / trebleCount) / 255;

  let weighted = 0;
  let total = 0;
  for (let i = 0; i < len; i++) {
    const v = audioData[i];
    weighted += i * v;
    total += v;
  }
  const centroid = total > 0 ? weighted / total / len : 0.5;

  let energySum = 0;
  for (let i = 0; i < len; i++) energySum += audioData[i];
  const energy = (energySum / len) / 255;

  const brightness = Math.min(1, Math.max(0, (centroid - 0.12) / 0.5));
  const mixBrightness = Math.min(1, Math.max(0, treble * 0.55 + brightness * 0.45));

  return {
    bass,
    treble,
    centroid,
    energy,
    brightness: mixBrightness,
    bands: extractFftBands(audioData),
  };
};
