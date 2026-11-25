/**
 * Converts a `#rrggbb` (or `rrggbb`) hex string into a normalized [0..1] RGB
 * triple suitable for a GLSL `vec3` uniform. Falls back to white on a bad
 * input so a typo'd palette color degrades visibly instead of throwing.
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!result) return { r: 255, g: 255, b: 255 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

export const hexToVec3 = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  return [r / 255, g / 255, b / 255];
};

export const lerpVec3 = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const smoothstep = (t) => t * t * (3 - 2 * t);

/**
 * Resolve preset colors for the current animation time. Presets with
 * `colorPalettes` crossfade between entries over `colorCycleSeconds` of
 * elapsed animation time; others return static `colors` unchanged.
 *
 * @returns {Record<string, [number, number, number]>} slot → RGB 0..1
 */
export const resolveCycledColors = (preset, animationTime) => {
  const slots = Object.keys(preset.colors);
  const palettes = preset.colorPalettes;

  if (!palettes?.length) {
    return Object.fromEntries(slots.map((key) => [key, hexToVec3(preset.colors[key])]));
  }

  if (palettes.length === 1) {
    return Object.fromEntries(
      slots.map((key) => [key, hexToVec3(palettes[0][key] ?? preset.colors[key])])
    );
  }

  const cycleSeconds = preset.colorCycleSeconds ?? 5;
  const cyclePos = (animationTime / cycleSeconds) * palettes.length;
  const idx = Math.floor(cyclePos) % palettes.length;
  const nextIdx = (idx + 1) % palettes.length;
  const blend = smoothstep(cyclePos - Math.floor(cyclePos));

  return Object.fromEntries(
    slots.map((key) => {
      const from = hexToVec3(palettes[idx][key] ?? preset.colors[key]);
      const to = hexToVec3(palettes[nextIdx][key] ?? preset.colors[key]);
      return [key, lerpVec3(from, to, blend)];
    })
  );
};
