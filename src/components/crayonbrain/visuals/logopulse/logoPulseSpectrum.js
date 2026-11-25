import {
  LOGOPULSE_FREQ_MAX,
  LOGOPULSE_FREQ_MIN,
  LOGOPULSE_MAX_DB,
  LOGOPULSE_MIN_DB,
} from './logoPulseConstants';

const DB_SPAN = LOGOPULSE_MAX_DB - LOGOPULSE_MIN_DB;
/** Tilt reference. Bands here keep their measured level. */
const TILT_REF_HZ = 160;
/**
 * Amplitude tilt per octave, as a power of frequency.
 * 0 follows the analyser dB. A little above 0 lifts hats without
 * inventing a ring of high bars in silence.
 */
const TILT = 0.22;
/** Mild curve so loud bands reach the rim and quiet ones stay short. */
const GAMMA = 1.3;
/** Logo punch follows the bass you hear, through this frequency. */
const BASS_HZ = 160;
/** Wider than one FFT bin: take the peak so a partial is not averaged away. */
const WIDE_BINS = 1.6;

const DB_FLOOR_MAG = 10 ** (LOGOPULSE_MIN_DB / 20);

/**
 * Bar i covers an equal fraction of log frequency from the low edge
 * to the high edge. Windows narrower than one FFT bin stay one bin wide
 * and are sampled between bins, so a bass note can move instead of
 * lighting a block of identical bars.
 *
 * @returns {{ b0: number, b1: number, hz: number }[]}
 */
export const buildLogoPulseBands = (binCount, barCount, sampleRate) => {
  const nyquist = sampleRate * 0.5;
  const maxHz = Math.min(LOGOPULSE_FREQ_MAX, nyquist * 0.94);
  const minHz = Math.min(LOGOPULSE_FREQ_MIN, maxHz / 4);
  const logMin = Math.log(minHz);
  const logMax = Math.log(Math.max(minHz * 1.01, maxHz));
  const binHz = sampleRate / (binCount * 2);
  const bands = new Array(barCount);

  for (let i = 0; i < barCount; i++) {
    const f0 = Math.exp(logMin + (logMax - logMin) * (i / barCount));
    const f1 = Math.exp(logMin + (logMax - logMin) * ((i + 1) / barCount));
    const hz = Math.sqrt(f0 * f1);
    let b0 = f0 / binHz;
    let b1 = f1 / binHz;
    if (b1 - b0 < 1) {
      const mid = hz / binHz;
      b0 = mid - 0.5;
      b1 = mid + 0.5;
    }
    b0 = Math.max(0, b0);
    b1 = Math.max(b0 + 0.25, Math.min(binCount, b1));
    bands[i] = { b0, b1, hz };
  }
  return bands;
};

/** Undo the analyser dB window, then tilt and gamma. 0..1. */
const perceptual = (norm, hz) => {
  if (norm <= 0) return 0;
  const db = LOGOPULSE_MIN_DB + Math.min(1, norm) * DB_SPAN;
  const mag = 10 ** (db / 20);
  const tilt = (Math.max(hz, 1) / TILT_REF_HZ) ** TILT;
  const lifted = Math.max(0, mag - DB_FLOOR_MAG) * tilt;
  if (lifted <= 0) return 0;
  const db2 = 20 * Math.log10(lifted + DB_FLOOR_MAG);
  const remapped = (db2 - LOGOPULSE_MIN_DB) / DB_SPAN;
  if (remapped <= 0) return 0;
  return Math.pow(Math.min(1, remapped), GAMMA);
};

/**
 * Peak (wide bands) or interpolated bin (narrow bands), shaped into a
 * bar level. Returns the strongest bass level for the logo punch.
 * Height is that band's own loudness, not its rise over a baseline
 * and not its size relative to the loudest band this frame.
 */
export const sampleLogoPulseBars = (freqData, bands, levels) => {
  const n = levels.length;
  if (!freqData?.length || !bands) {
    levels.fill(0);
    return 0;
  }

  const last = freqData.length - 1;
  let bass = 0;

  for (let i = 0; i < n; i++) {
    const band = bands[i];
    const start = Math.max(0, Math.floor(band.b0));
    const end = Math.min(last, Math.ceil(band.b1) - 1);
    let peak = 0;
    let sum = 0;
    let weight = 0;

    for (let b = start; b <= end; b++) {
      if (b === 0) continue;
      const lo = Math.max(b, band.b0);
      const hi = Math.min(b + 1, band.b1);
      const w = hi - lo;
      if (w <= 0) continue;
      const v = freqData[b];
      if (v > peak) peak = v;
      sum += v * w;
      weight += w;
    }

    const wide = band.b1 - band.b0 > WIDE_BINS;
    const norm = weight > 0 ? (wide ? peak : sum / weight) / 255 : 0;
    const level = perceptual(norm, band.hz);
    levels[i] = level;
    if (band.hz <= BASS_HZ && level > bass) bass = level;
  }

  return bass;
};
