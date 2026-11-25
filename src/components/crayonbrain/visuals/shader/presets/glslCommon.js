/**
 * Shared GLSL source shared by every shader preset — noise/fbm/rotation
 * helpers and the single fullscreen vertex shader. Presets splice
 * `GLSL_NOISE_LIB` into their fragment shader source rather than each
 * reimplementing noise, so adding a new preset (e.g. "waves", "cells")
 * only means writing a `main()` that uses these building blocks.
 */

/** Fullscreen-triangle vertex shader — identical for every preset. */
export const FULLSCREEN_VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Value noise + fbm (fractal Brownian motion) + 2D rotation, WebGL1 (GLSL ES
 * 1.00) compatible. Based on the widely-used gradient/simplex-style value
 * noise popularized by Inigo Quilez for procedural marble/wood/agate looks.
 */
export const GLSL_NOISE_LIB = `
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float valueNoise(vec2 p) {
  const float K1 = 0.366025404; // (sqrt(3)-1)/2
  const float K2 = 0.211324865; // (3-sqrt(3))/6
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = a.x > a.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
  return dot(n, vec3(70.0));
}

/** Five-octave fractal sum — the "turbulence" texture under most organic shader looks. */
float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * valueNoise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return sum;
}

vec2 rotate2d(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c) * p;
}
`;

/**
 * Angular mirror-fold helper for kaleidoscope-style symmetry. Splice
 * alongside `GLSL_NOISE_LIB` in any preset that wants to tile a pattern into
 * repeating mirrored wedges (fold the UV with `kaleidoFold` *before* feeding
 * it into noise/warp/periodic-function code — everything downstream just
 * sees a pre-mirrored coordinate and doesn't need to know about the fold).
 */
export const GLSL_KALEIDO_LIB = `
vec2 kaleidoFold(vec2 p, float segments) {
  float segs = max(floor(segments + 0.5), 1.0);
  float wedge = 6.28318530718 / segs;
  float r = length(p);
  float a = mod(atan(p.y, p.x), wedge);
  a = abs(a - wedge * 0.5);
  return vec2(cos(a), sin(a)) * r;
}
`;
