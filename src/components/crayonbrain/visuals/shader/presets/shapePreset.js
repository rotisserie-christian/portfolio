/**
 * Shared builder for the Hypnosis tab. Each preset is a fullscreen fragment
 * shader on the existing shader renderer: params and colors become uniforms,
 * and `speed` drives the animation clock instead of a shader uniform.
 *
 * Eight log-spaced FFT bands arrive as separate uniforms (`u_audioBand0` is
 * the lowest group). `audioBand` / `audioBandAt` pick them with constant
 * indices so the shader compiles on WebGL1.
 */

import { SHADER_FFT_BANDS } from '../../audio/fftFeatures';

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const BAND_UNIFORMS = Array.from(
  { length: SHADER_FFT_BANDS },
  (_, index) => `uniform float u_audioBand${index};`,
).join('\n');

const ONSET_UNIFORMS = Array.from(
  { length: SHADER_FFT_BANDS },
  (_, index) => `uniform float u_audioOnset${index};`,
).join('\n');

const audioBandFunction = () => {
  const lines = ['float v = u_audioBand0;'];
  for (let i = 1; i < SHADER_FFT_BANDS; i++) {
    lines.push(`if (band == ${i}) v = u_audioBand${i};`);
  }
  return `float audioBand(int band) {\n  ${lines.join('\n  ')}\n  return v;\n}`;
};

const audioBandAtFunction = () => {
  const last = SHADER_FFT_BANDS - 1;
  const lines = [];
  for (let i = 0; i < last; i++) {
    lines.push(`if (idx < ${i}.5) return mix(audioBand(${i}), audioBand(${i + 1}), f);`);
  }
  lines.push(`return audioBand(${last});`);
  return `float audioBandAt(float t) {
  float x = clamp(t, 0.0, 1.0) * ${last}.0;
  float idx = floor(x);
  float f = x - idx;
  ${lines.join('\n  ')}
}`;
};

const audioOnsetFunction = () => {
  const lines = ['float v = u_audioOnset0;'];
  for (let i = 1; i < SHADER_FFT_BANDS; i++) {
    lines.push(`if (band == ${i}) v = u_audioOnset${i};`);
  }
  return `float audioOnset(int band) {\n  ${lines.join('\n  ')}\n  return v;\n}`;
};

const audioOnsetAtFunction = () => {
  const last = SHADER_FFT_BANDS - 1;
  const lines = [];
  for (let i = 0; i < last; i++) {
    lines.push(`if (idx < ${i}.5) return mix(audioOnset(${i}), audioOnset(${i + 1}), f);`);
  }
  lines.push(`return audioOnset(${last});`);
  return `float audioOnsetAt(float t) {
  float x = clamp(t, 0.0, 1.0) * ${last}.0;
  float idx = floor(x);
  float f = x - idx;
  ${lines.join('\n  ')}
}`;
};

export const GLSL_AUDIO_BAND_UNIFORMS = `${BAND_UNIFORMS}
${ONSET_UNIFORMS}`;

export const GLSL_AUDIO_BAND_FNS = `${audioBandFunction()}
${audioBandAtFunction()}
${audioOnsetFunction()}
${audioOnsetAtFunction()}`;

export const GLSL_SHAPE_LIB = `
vec2 rotate2d(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

float strokeMask(float dist, float width, float aa) {
  return 1.0 - smoothstep(max(width - aa, 0.0), width + aa, dist);
}

float fillMask(float sd, float aa) {
  return 1.0 - smoothstep(-aa, aa, sd);
}

// Distance from the border of a hex cell. 0 on the edge, positive inside.
float hexBorder(vec2 p) {
  vec2 r = vec2(1.0, 1.7320508);
  vec2 h = r * 0.5;
  vec2 a = mod(p, r) - h;
  vec2 b = mod(p - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  gv = abs(gv);
  return 0.5 - max(gv.x, gv.y * 0.8660254 + gv.x * 0.5);
}

vec3 shadeShape(vec3 bg, vec3 ink, vec3 accent, float mask, float accentMask, vec2 uv) {
  vec3 col = mix(bg, ink, clamp(mask, 0.0, 1.0));
  col = mix(col, accent, clamp(accentMask, 0.0, 1.0));
  float vig = smoothstep(1.35, 0.18, length(uv));
  return col * (0.32 + 0.68 * vig);
}

${audioBandFunction()}
${audioBandAtFunction()}
${audioOnsetFunction()}
${audioOnsetAtFunction()}
`;

export const buildShapeShader = (paramKeys, colorKeys, body, prelude = '') => {
  const params = paramKeys
    .filter((key) => key !== 'speed')
    .map((key) => `uniform float u_${key};`)
    .join('\n');
  const colors = colorKeys
    .map((key) => `uniform vec3 u_color${capitalize(key)};`)
    .join('\n');

  return `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
${params}
${colors}
${GLSL_AUDIO_BAND_UNIFORMS}

${GLSL_SHAPE_LIB}
${prelude}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float aa = 1.5 / min(u_resolution.x, u_resolution.y);
  ${body}
}
`;
};

export const makeShapePreset = ({
  id,
  label,
  params,
  paramRanges,
  palettes,
  audioReactivity,
  body,
  prelude = '',
  extraUniforms = [],
  colorCycleSeconds = 18,
}) => ({
  id,
  label,
  params,
  paramRanges,
  colors: palettes[0],
  colorPalettes: palettes,
  colorCycleSeconds,
  audioReactivity,
  extraUniforms,
  fragmentShader: buildShapeShader(Object.keys(params), Object.keys(palettes[0]), body, prelude),
});
