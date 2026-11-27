import { SHADER_FFT_BANDS } from '../../audio/fftFeatures';
import { makeShapePreset } from './shapePreset';

/**
 * Simple geometric patterns for the Crayonbrain Shader tab.
 * Same trick as Kaleidoscope: radius picks an FFT band, that band lights
 * the pattern there, and the low and high bands also bend it. Quiet bands
 * stay dim. The repeats still hit zero between crests, so a loud mix
 * cannot fill the frame. Ripples and Spiral move on the onset (the rise
 * above the recent level) and keep their brightness on the sustained
 * level, so a held note stays lit without pinning the motion. The ripple
 * figure follows the waveform in the buffer: a sine stays a circle, a
 * triangle wave adds a diamond, a square wave a square, and a saw a
 * triangle. Each figure keeps its own color, and crossings add the colors
 * together. Lattice
 * raymarches straight down a hall, and sometimes turns 90 degrees onto
 * another one. Energy and the top band speed that flight.
 */

const RIPPLE_WAVE_UNIFORMS = Array.from(
  { length: SHADER_FFT_BANDS },
  (_, index) => `u_wave${index}`,
);

const buildRipplePrelude = () => {
  const uniforms = RIPPLE_WAVE_UNIFORMS
    .map((name) => `uniform vec4 ${name};`)
    .join('\n');
  const lines = ['vec4 v = u_wave0;'];
  for (let i = 1; i < SHADER_FFT_BANDS; i++) {
    lines.push(`if (band == ${i}) v = u_wave${i};`);
  }
  const last = SHADER_FFT_BANDS - 1;
  const mixes = [];
  for (let i = 0; i < last; i++) {
    mixes.push(`if (idx < ${i}.5) return mix(waveShape(${i}), waveShape(${i + 1}), f);`);
  }
  mixes.push(`return waveShape(${last});`);

  return `
${uniforms}

// shape.xyzw = sine, triangle, square, saw.
vec4 waveShape(int band) {
  ${lines.join('\n  ')}
  return v;
}

vec4 waveShapeAt(float t) {
  float x = clamp(t, 0.0, 1.0) * ${last}.0;
  float idx = floor(x);
  float f = x - idx;
  ${mixes.join('\n  ')}
}

float shapeWeight(vec4 shape, int component) {
  if (component == 1) return shape.y;
  if (component == 2) return shape.z;
  if (component == 3) return shape.w;
  return shape.x;
}

// Quadrature scope figure. 0 circle, 1 diamond, 2 square, 3 triangle.
float scopeRadius(vec2 p, int component) {
  float r = length(p);
  if (component == 0) return r;
  float ang = atan(p.y, p.x) - u_time * 0.2;
  float c = abs(cos(ang));
  float s = abs(sin(ang));
  if (component == 1) return (c + s) * r;
  if (component == 2) return max(c, s) * r * 1.41421356;
  float seg = 2.09439510;
  float a = mod(ang + 0.52359878, seg) - seg * 0.5;
  return r * cos(a) * 2.0;
}

vec2 rippleTrace(float rad, int component, float bend) {
  float zone = clamp(rad / 0.95, 0.0, 0.999);
  float weight = shapeWeight(waveShapeAt(zone), component);
  float hot = smoothstep(0.04, 0.42, audioBandAt(zone));
  float kick = smoothstep(0.04, 0.42, audioOnsetAt(zone));
  float low = smoothstep(0.04, 0.42, audioBand(0));
  float spacing = 1.0 / max(u_density, 1.0);
  float edge = smoothstep(0.08, 0.45, rad);
  float shifted = rad + bend - edge * spacing * (kick * 0.22 + low * 0.1);
  float phase = shifted * u_density - u_time * 2.6;
  float sharp = mix(9.0, 3.2, hot) * clamp(0.012 / max(u_width, 0.004), 0.45, 2.2);
  float wave = pow(abs(sin(phase * 3.14159265)), sharp);
  float glow = wave * (0.1 + 0.9 * hot) * weight;
  float accent = smoothstep(0.35, 0.9, wave) * hot * weight;
  return vec2(glow, accent);
}

vec3 hueShift(vec3 color, float turns) {
  vec3 axis = vec3(0.57735027);
  float a = turns * 6.2831853;
  float c = cos(a);
  return color * c + cross(axis, color) * sin(a) + axis * dot(axis, color) * (1.0 - c);
}

vec3 rippleLayer(vec3 tint, vec2 hit) {
  vec3 crest = mix(tint, vec3(1.0), 0.42);
  return tint * hit.x + crest * hit.y;
}
`;
};

const BY_ID = {
  ripples: makeShapePreset({
    id: 'ripples',
    label: 'Ripples',
    params: {
      density: 8,
      width: 0.012,
      speed: 0.55,
    },
    paramRanges: {
      density: [5, 16],
      width: [0.006, 0.028],
      speed: [0.25, 1.3],
    },
    palettes: [
      { bg: '#071018', ink: '#b8fff2', accent: '#3d8bfd' },
      { bg: '#120816', ink: '#f6d6ff', accent: '#c77dff' },
      { bg: '#07140f', ink: '#d9ffe8', accent: '#2ec4b6' },
    ],
    audioReactivity: {
      speed: { source: 'energy', amount: 0.16 },
    },
    extraUniforms: RIPPLE_WAVE_UNIFORMS,
    prelude: buildRipplePrelude(),
    body: `
      float euclid = length(uv);
      float low = smoothstep(0.04, 0.42, audioBand(0));
      float high = smoothstep(0.04, 0.42, audioBand(7));
      float spacing = 1.0 / max(u_density, 1.0);
      float edge = smoothstep(0.08, 0.45, euclid);
      float wobble = sin(atan(uv.y, uv.x) * 5.0 + u_time) * high * spacing * 0.18 * edge;
      vec2 circleHit = rippleTrace(scopeRadius(uv, 0), 0, wobble);
      vec2 diamondHit = rippleTrace(scopeRadius(uv, 1), 1, 0.0);
      vec2 squareHit = rippleTrace(scopeRadius(uv, 2), 2, 0.0);
      vec2 sawHit = rippleTrace(scopeRadius(uv, 3), 3, 0.0);
      vec3 col = u_colorBg;
      col += rippleLayer(u_colorInk, circleHit);
      col += rippleLayer(hueShift(u_colorInk, 0.14), diamondHit);
      col += rippleLayer(u_colorAccent, squareHit);
      col += rippleLayer(hueShift(u_colorAccent, 0.22), sawHit);
      col += u_colorInk * exp(-euclid * 7.5) * low * 0.75;
      float vig = smoothstep(1.35, 0.18, euclid);
      col *= 0.32 + 0.68 * vig;
      gl_FragColor = vec4(col, 1.0);
    `,
  }),
};

export const RIPPLES_PRESET = BY_ID.ripples;
