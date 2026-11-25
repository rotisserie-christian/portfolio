import { smoothToward } from '../audio/fftFeatures';
import {
  DEFAULT_LOGOPULSE_SETTINGS,
  LOGOPULSE_BAR_COUNT,
  LOGOPULSE_BAR_GAP,
  LOGOPULSE_BAR_INNER_PAD,
  LOGOPULSE_BAR_MAX_FRAC,
  LOGOPULSE_BG,
  LOGOPULSE_CYCLE_COLORS,
  LOGOPULSE_LOGO_FRAC,
  LOGOPULSE_LOGO_MAX_PX,
  LOGOPULSE_LOGO_PUNCH,
  hexToRgb,
  logoPulseLiveSettings,
  normalizeLogoPulseSettings,
} from './logoPulseConstants';
import { buildLogoPulseBands, sampleLogoPulseBars } from './logoPulseSpectrum';

const drawScopeMode = (ctx, { width, height }) => {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
};

const lerp = (a, b, t) => a + (b - a) * t;

/** Bars fall this fast. Rises copy the level on the same frame. */
const BAR_FALL_MS = 64;

const colorAtHorizontal = (u, phase, colors = LOGOPULSE_CYCLE_COLORS) => {
  const n = colors.length;
  if (!n) return { r: 255, g: 45, b: 170 };
  const t = ((u + phase) % 1 + 1) % 1;
  const scaled = t * n;
  const i0 = Math.floor(scaled) % n;
  const i1 = (i0 + 1) % n;
  const f = scaled - Math.floor(scaled);
  const c0 = colors[i0];
  const c1 = colors[i1];
  return {
    r: Math.round(lerp(c0.r, c1.r, f)),
    g: Math.round(lerp(c0.g, c1.g, f)),
    b: Math.round(lerp(c0.b, c1.b, f)),
  };
};

const rgba = ({ r, g, b }, a) => `rgba(${r},${g},${b},${a})`;

/** Spread each bar into its neighbors so the outline reads as one shape. */
const BLOB_BLUR_PASSES = 12;

const blurBarLevels = (source, dest, scratch) => {
  const n = source.length;
  dest.set(source);
  for (let pass = 0; pass < BLOB_BLUR_PASSES; pass++) {
    const read = pass % 2 === 0 ? dest : scratch;
    const write = pass % 2 === 0 ? scratch : dest;
    for (let i = 0; i < n; i++) {
      const prev = read[i === 0 ? 0 : i - 1];
      const next = read[i === n - 1 ? n - 1 : i + 1];
      write[i] = prev * 0.25 + read[i] * 0.5 + next * 0.25;
    }
  }
  if (BLOB_BLUR_PASSES % 2 === 1) dest.set(scratch);
};

/** A long peak lifts both neighbors, so it cannot stand alone between short bars. */
const SPIKE_LEVEL = 0.4;
const SPIKE_SHOULDER = 0.8;

const widenLoneSpikes = (source, dest) => {
  const n = source.length;
  dest.set(source);
  for (let i = 0; i < n; i++) {
    const peak = source[i];
    if (peak < SPIKE_LEVEL) continue;
    const left = i > 0 ? source[i - 1] : peak;
    const right = i < n - 1 ? source[i + 1] : peak;
    if (peak < left || peak < right) continue;
    const shoulder = peak * SPIKE_SHOULDER;
    if (i > 0 && left < shoulder) dest[i - 1] = Math.max(dest[i - 1], shoulder);
    if (i < n - 1 && right < shoulder) dest[i + 1] = Math.max(dest[i + 1], shoulder);
  }
};

/**
 * Canvas renderer: one mirrored ring of log-spaced spectrum bars around the logo.
 */
const paletteFromSettings = (settings) => {
  const normalized = normalizeLogoPulseSettings(settings ?? DEFAULT_LOGOPULSE_SETTINGS);
  return {
    palette: normalized.colors.map(hexToRgb),
    style: normalized.style,
    sizeGain: (normalized.size / 100) * 0.6,
    backgroundAlpha: normalized.backgroundOpacity / 100,
  };
};

/** Extra pixels around each overlay bar: stroke width and each end. */
const OVERLAY_BAR_PAD = 5;
const OVERLAY_BAR_PLATE = 'rgba(0, 0, 0, 0.46)';

export const createLogoPulseRenderer = ({
  canvas,
  settings = DEFAULT_LOGOPULSE_SETTINGS,
  overlay = false,
}) => {
  const ctx = canvas?.getContext?.('2d', { alpha: overlay });
  if (!ctx) {
    return {
      ready: false,
      resetState() {},
      setLogoImage() {},
      setBackgroundImage() {},
      setMode() {},
      setSettings() {},
      renderFrame() {},
      dispose() {},
    };
  }

  const barCount = LOGOPULSE_BAR_COUNT;
  const barPeaks = new Float32Array(barCount);
  const barLevels = new Float32Array(barCount);
  const blobLevels = new Float32Array(barCount);
  const blobScratch = new Float32Array(barCount);
  let bands = null;
  let bandKey = '';
  let logoImage = null;
  let backgroundImage = null;
  let logoPunch = 0;
  let palette = LOGOPULSE_CYCLE_COLORS;
  let pulseStyle = 'bars';
  let sizeGain = 1;
  let backgroundAlpha = 1;
  let scopeElapsed = 0;

  const applySettings = (next) => {
    const resolved = paletteFromSettings(next);
    palette = resolved.palette;
    pulseStyle = overlay ? 'bars' : resolved.style;
    sizeGain = resolved.sizeGain;
    backgroundAlpha = resolved.backgroundAlpha;
  };
  applySettings(settings);
  let appliedSettings = settings;

  const drawRadialBars = (cx, cy, innerR, maxLen, phase) => {
    if (barCount < 2 || maxLen <= 1 || innerR <= 0) return;
    widenLoneSpikes(barLevels, blobLevels);
    const slot = Math.PI / (barCount - 1);
    const barWidth = Math.max(1.5, innerR * slot * (1 - LOGOPULSE_BAR_GAP));
    const cap = barWidth * 0.5;

    const strokeRing = (lineWidth, styleFor, extend) => {
      ctx.lineWidth = lineWidth;
      for (let i = 0; i < barCount; i++) {
        const level = blobLevels[i];
        const len = level * maxLen;
        if (len < 0.8) continue;
        const t = i / (barCount - 1);
        ctx.strokeStyle = styleFor(t, level);
        const r0 = Math.max(1, innerR + cap - extend);
        const r1 = innerR + cap + len + extend;
        const right = Math.PI / 2 - t * Math.PI;
        const left = Math.PI / 2 + t * Math.PI;
        const strokeAt = (angle) => {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(cx + cos * r0, cy + sin * r0);
          ctx.lineTo(cx + cos * r1, cy + sin * r1);
          ctx.stroke();
        };
        strokeAt(right);
        if (i !== 0 && i !== barCount - 1) strokeAt(left);
      }
    };

    ctx.save();
    ctx.lineCap = 'round';
    if (overlay) {
      strokeRing(barWidth + OVERLAY_BAR_PAD * 2, () => OVERLAY_BAR_PLATE, OVERLAY_BAR_PAD);
    }
    strokeRing(
      barWidth,
      (t, level) => rgba(colorAtHorizontal(t, phase, palette), 0.42 + level * 0.58),
      0,
    );
    ctx.restore();
  };

  /**
   * Bars with the gaps closed and the heights blurred into their neighbors.
   * Same angles and colors; the silhouette is one continuous shape.
   */
  const drawBlob = (cx, cy, innerR, maxLen) => {
    if (barCount < 2 || maxLen <= 1 || innerR <= 0) return;
    blurBarLevels(barLevels, blobLevels, blobScratch);

    const fillSide = (t0, t1, level0, level1, angleFor) => {
      const height = Math.max(level0, level1);
      if (height * maxLen < 0.8) return;
      const a0 = angleFor(t0);
      const a1 = angleFor(t1);
      const r0 = innerR + level0 * maxLen;
      const r1 = innerR + level1 * maxLen;
      const col = colorAtHorizontal((t0 + t1) * 0.5, 0, palette);
      ctx.fillStyle = rgba(col, 0.5 + height * 0.5);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a0) * innerR, cy + Math.sin(a0) * innerR);
      ctx.lineTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0);
      ctx.lineTo(cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1);
      ctx.lineTo(cx + Math.cos(a1) * innerR, cy + Math.sin(a1) * innerR);
      ctx.closePath();
      ctx.fill();
    };

    ctx.save();
    for (let i = 0; i < barCount - 1; i++) {
      const t0 = i / (barCount - 1);
      const t1 = (i + 1) / (barCount - 1);
      const level0 = blobLevels[i];
      const level1 = blobLevels[i + 1];
      fillSide(t0, t1, level0, level1, (t) => Math.PI / 2 - t * Math.PI);
      fillSide(t0, t1, level0, level1, (t) => Math.PI / 2 + t * Math.PI);
    }
    ctx.restore();
  };

  const logoDiskSize = (minDim, punch) => {
    const diameter =
      Math.min(minDim * LOGOPULSE_LOGO_FRAC, LOGOPULSE_LOGO_MAX_PX) *
      (1 + punch * LOGOPULSE_LOGO_PUNCH);
    return { diameter, radius: diameter * 0.5 };
  };

  const drawCircularScope = (cx, cy, radius, timeData) => {
    const diameter = radius * 2;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.translate(cx - radius, cy - radius);
    drawScopeMode(ctx, {
      width: diameter,
      height: diameter,
      timeData,
      nowMs: scopeElapsed,
    });
    ctx.restore();
  };

  const drawCircularLogo = (cx, cy, minDim, punch, timeData) => {
    const { diameter, radius } = logoDiskSize(minDim, punch);
    const hasLogo = logoImage && logoImage.complete && logoImage.naturalWidth > 0;
    if (!hasLogo) {
      drawCircularScope(cx, cy, radius, timeData);
      return;
    }
    const iw = logoImage.naturalWidth;
    const ih = logoImage.naturalHeight;
    const scale = Math.max(diameter / iw, diameter / ih);
    const dw = iw * scale;
    const dh = ih * scale;

    if (punch > 0.05) {
      const ringCol = colorAtHorizontal(0.5, 0, palette);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const ringR = radius * (1.05 + punch * 0.1);
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, ringR);
      grad.addColorStop(0, rgba(ringCol, 0.3 * punch));
      grad.addColorStop(1, rgba(ringCol, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = '#000000';
    ctx.fillRect(cx - radius, cy - radius, diameter, diameter);
    ctx.drawImage(logoImage, cx - dw * 0.5, cy - dh * 0.5, dw, dh);
    ctx.restore();
  };

  return {
    ready: true,

    resetState() {
      barPeaks.fill(0);
      barLevels.fill(0);
      blobLevels.fill(0);
      logoPunch = 0;
    },

    setLogoImage(img) {
      logoImage = img || null;
    },

    setBackgroundImage(img) {
      backgroundImage = img || null;
    },

    setMode() {},

    setSettings(next) {
      appliedSettings = next;
      applySettings(next);
    },

    renderFrame({ freqData, timeData = null, deltaMs, width, height, sampleRate = 44100 }) {
      if (!overlay && logoPulseLiveSettings.current !== appliedSettings) {
        appliedSettings = logoPulseLiveSettings.current;
        applySettings(appliedSettings);
      }
      if (width <= 0 || height <= 0) return;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (overlay) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = LOGOPULSE_BG;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const dpr = canvas.width / width;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (
        !overlay
        && backgroundImage
        && backgroundImage.complete
        && backgroundImage.naturalWidth > 0
        && backgroundAlpha > 0
      ) {
        const iw = backgroundImage.naturalWidth;
        const ih = backgroundImage.naturalHeight;
        const cover = Math.max(width / iw, height / ih);
        const dw = iw * cover;
        const dh = ih * cover;
        ctx.save();
        ctx.globalAlpha = backgroundAlpha;
        ctx.drawImage(backgroundImage, (width - dw) * 0.5, (height - dh) * 0.5, dw, dh);
        ctx.restore();
      }

      const dt = Math.min(deltaMs || 16, 50);
      const rate = sampleRate > 0 ? sampleRate : 44100;
      const binCount = freqData?.length ?? 0;
      const nextKey = binCount ? `${binCount}:${rate}` : '';
      if (nextKey && nextKey !== bandKey) {
        bands = buildLogoPulseBands(binCount, barCount, rate);
        bandKey = nextKey;
      }
      const kick = sampleLogoPulseBars(freqData, bands, barPeaks);
      for (let i = 0; i < barCount; i++) {
        const target = barPeaks[i];
        if (target >= barLevels[i]) barLevels[i] = target;
        else barLevels[i] = smoothToward(barLevels[i], target, dt, 1, BAR_FALL_MS);
      }
      if (kick >= logoPunch) logoPunch = kick;
      else logoPunch = smoothToward(logoPunch, kick, dt, 1, 70);
      const cx = width * 0.5;
      const cy = height * 0.5;
      const minDim = Math.min(width, height);
      const { radius: logoRadius } = logoDiskSize(minDim, logoPunch);
      const innerR = logoRadius + minDim * LOGOPULSE_BAR_INNER_PAD;
      const outerLimit = Math.min(cx, cy, width - cx, height - cy) * LOGOPULSE_BAR_MAX_FRAC;
      const maxLen = Math.max(0, (outerLimit - innerR) * sizeGain);
      scopeElapsed += dt;

      if (pulseStyle === 'blob') drawBlob(cx, cy, innerR, maxLen);
      else drawRadialBars(cx, cy, innerR, maxLen, 0);

      drawCircularLogo(cx, cy, minDim, logoPunch, timeData);
    },

    dispose() {
      logoImage = null;
      backgroundImage = null;
    },
  };
};
