/** Usual profile-pic style file restrictions for the replace/upload input. */
export const LOGOPULSE_IMAGE_ACCEPT =
  'image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp';

export const LOGOPULSE_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export const LOGOPULSE_IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const LOGOPULSE_IMAGE_MAX_DIMENSION = 4096;

export const LOGOPULSE_BG = '#000000';

/** Palette mapped around the pulse. Bars and Blob share it. */
export const LOGOPULSE_CYCLE_COLORS = [
  { r: 255, g: 45, b: 170 }, // magenta
  { r: 255, g: 70, b: 70 }, // coral-red
  { r: 255, g: 170, b: 40 }, // amber
  { r: 50, g: 230, b: 120 }, // mint
  { r: 40, g: 190, b: 255 }, // cyan
  { r: 140, g: 90, b: 255 }, // violet
];

const channelHex = (n) => n.toString(16).padStart(2, '0');

export const rgbToHex = ({ r, g, b }) => `#${channelHex(r)}${channelHex(g)}${channelHex(b)}`;

export const hexToRgb = (hex) => {
  const n = parseInt(String(hex).replace('#', ''), 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
};

export const LOGOPULSE_COLOR_HEX = LOGOPULSE_CYCLE_COLORS.map(rgbToHex);

export const LOGOPULSE_STYLES = [
  { id: 'bars', label: 'Bars' },
  { id: 'blob', label: 'Blob' },
];

const LOGOPULSE_STYLE_IDS = new Set(LOGOPULSE_STYLES.map((style) => style.id));

/** Bars is the radial spectrum. Blob is those bars with the gaps closed and the heights smoothed. */
export const DEFAULT_LOGOPULSE_SETTINGS = {
  style: 'bars',
  size: 100,
  backgroundOpacity: 15,
  colors: LOGOPULSE_COLOR_HEX,
};

/** Latest settings for the canvas loop. The preview element is memoized, so it reads this instead of waiting on a new React render. */
export const logoPulseLiveSettings = { current: DEFAULT_LOGOPULSE_SETTINGS };

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

const clampOpacity = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 15;
  return Math.min(100, Math.max(0, Math.round(n)));
};

const clampSize = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 100;
  return Math.min(200, Math.max(0, Math.round(n)));
};

export const normalizeLogoPulseSettings = (value) => {
  const source = value && typeof value === 'object' ? value : {};
  return {
    style: LOGOPULSE_STYLE_IDS.has(source.style) ? source.style : 'bars',
    size: clampSize(source.size),
    backgroundOpacity: clampOpacity(source.backgroundOpacity),
    colors: LOGOPULSE_COLOR_HEX.map((fallback, index) => {
      const next = source.colors?.[index];
      return typeof next === 'string' && HEX_COLOR.test(next) ? next.toLowerCase() : fallback;
    }),
  };
};

/**
 * Analyser window the bars invert. Byte 0 is MIN_DB, byte 255 is MAX_DB.
 * The shared visualizer tap uses a narrower window and heavier smoothing,
 * which pins loud bands and smears hits, so Logo Pulse taps its own.
 */
export const LOGOPULSE_FFT_SIZE = 2048;
export const LOGOPULSE_FFT_SMOOTHING = 0.25;
export const LOGOPULSE_MIN_DB = -90;
export const LOGOPULSE_MAX_DB = -20;

/** Bottom of the ring, and the top. Equal log steps between them. */
export const LOGOPULSE_FREQ_MIN = 40;
export const LOGOPULSE_FREQ_MAX = 16000;

/** Log-spaced bands per side. Bass is at the bottom, treble at the top, mirrored. */
export const LOGOPULSE_BAR_COUNT = 56;
/** Empty fraction of each bar's angular slot. */
export const LOGOPULSE_BAR_GAP = 0.38;
/** Gap between the logo edge and the bar roots, as a fraction of the shorter side. */
export const LOGOPULSE_BAR_INNER_PAD = 0.018;
/** Full-scale bar tip, as a fraction of the distance from center to the canvas edge. */
export const LOGOPULSE_BAR_MAX_FRAC = 0.94;

export const LOGOPULSE_LOGO_FRAC = 0.36;
export const LOGOPULSE_LOGO_MAX_PX = 440;
export const LOGOPULSE_LOGO_PUNCH = 0.06;

/** Kept so older callers can still pass a mode into the renderer. */
export const LOGOPULSE_MODES = {
  radial: { id: 'radial', label: 'Radial' },
  'radial-particles': { id: 'radial-particles', label: 'Radial & Particles' },
};
export const DEFAULT_LOGOPULSE_MODE = 'radial-particles';

/**
 * Validate an uploaded logo file against usual profile-pic restrictions.
 * @param {File} file
 * @returns {string} empty string when valid, otherwise an error message
 */
export const validateLogoPulseImageFile = (file) => {
  if (!file) return 'No file selected';
  const type = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  const extOk = /\.(jpe?g|png|webp)$/.test(name);
  if (!LOGOPULSE_IMAGE_MIME_TYPES.has(type) && !extOk) {
    return 'Please select a JPEG, PNG, or WebP image';
  }
  if (file.size > LOGOPULSE_IMAGE_MAX_BYTES) {
    return 'Image is too large. Maximum size is 5MB';
  }
  return '';
};
