import {
  classifyWaveform,
  extractMathAudioFeatures,
  resolveShapeBandDrives,
  resolveShapeBandOnsets,
  SHADER_FFT_BANDS,
  smoothToward,
} from '../audio/fftFeatures';
import { createWebGLContext } from '../webgl/glContext';
import { createProgram, getUniformLocations } from '../webgl/shaderProgram';
import { createFullscreenTriangle, drawFullscreenTriangle } from '../webgl/fullscreenQuad';
import { hexToVec3, resolveCycledColors } from '../webgl/colorUtils';
import { FULLSCREEN_VERTEX_SHADER } from './presets/glslCommon';
import { getShaderPreset } from './presets';
import { createLatticePath } from './latticePath';
import {
  AUDIO_ATTACK_MS,
  AUDIO_BAND_ATTACK_MS,
  AUDIO_BAND_BASE_ATTACK_MS,
  AUDIO_BAND_BASE_RELEASE_MS,
  AUDIO_BAND_RELEASE_MS,
  AUDIO_RELEASE_MS,
  AUDIO_FEATURE_GAIN,
  AUDIO_EMPHASIZE_GAIN,
  IDLE_SPEED_FRACTION,
  MAX_FRAME_DELTA_MS,
  SPEED_ATTACK_MS,
  SPEED_WARMUP_MS,
  SPEED_WARMUP_FEATURE,
  SPEED_RAW_BLEND,
} from './shaderConstants';

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

/** Standard audio uniforms every preset may optionally read in its fragment shader. */
export const SHADER_AUDIO_UNIFORM_NAMES = ['u_audioBass', 'u_audioTreble', 'u_audioEnergy'];

/** Per-bin uniforms. Separate floats (not an array) so WebGL1 can pick a band
 *  with a constant index inside `audioBand()`. */
export const SHADER_AUDIO_BAND_UNIFORM_NAMES = Array.from(
  { length: SHADER_FFT_BANDS },
  (_, index) => `u_audioBand${index}`,
);

/** Per-band rise above the slow baseline. Separate from the drive so a held
 *  note can stay lit without keeping the motion pinned. */
export const SHADER_AUDIO_ONSET_UNIFORM_NAMES = Array.from(
  { length: SHADER_FFT_BANDS },
  (_, index) => `u_audioOnset${index}`,
);

/** Ripples scope figure, copied onto every ring. xyzw = sine, triangle, square, saw. */
const SHADER_WAVE_UNIFORM_NAMES = Array.from(
  { length: SHADER_FFT_BANDS },
  (_, index) => `u_wave${index}`,
);

const WAVE_ATTACK_MS = 90;
const WAVE_RELEASE_MS = 280;
const SINE_WAVE = [1, 0, 0, 0];

/** Lift + curve raw 0..1 features so hits read clearly on procedural shaders. */
export const emphasizeShaderAudioFeature = (value, gain = AUDIO_FEATURE_GAIN) =>
  Math.min(1, 1 - Math.exp(-value * gain * AUDIO_EMPHASIZE_GAIN));

const SILENT_FEATURES = { bass: 0, treble: 0, energy: 0, centroid: 0.5, brightness: 0.5 };

/**
 * Shader renderer for the live RAF hook.
 * Owns GL state, audio smoothing, the animation clock, and uniform upload.
 */
export const createShaderRenderer = ({
  canvas,
  presetId,
}) => {
  const failedRenderer = () => ({
    ready: false,
    setPreset: () => {},
    resetState: () => {},
    renderFrame: () => false,
    dispose: () => {},
  });

  const ctxResult = createWebGLContext(canvas);
  if (!ctxResult) {
    return failedRenderer();
  }

  let gl = ctxResult.gl;
  let quad = createFullscreenTriangle(gl);
  let program = null;
  let uniforms = null;
  let positionLocation = 0;
  let presetDef = getShaderPreset(presetId);
  let activePresetId = null;

  const smoothedFeatures = { ...SILENT_FEATURES };
  const fastBands = new Float32Array(SHADER_FFT_BANDS);
  const baseBands = new Float32Array(SHADER_FFT_BANDS);
  const uploadBands = new Float32Array(SHADER_FFT_BANDS);
  const uploadOnsets = new Float32Array(SHADER_FFT_BANDS);
  const waveShapes = Array.from(
    { length: SHADER_FFT_BANDS },
    () => Float32Array.from(SINE_WAVE),
  );
  let speedSmoothedEnergy = 0;
  let playingMs = 0;
  let elapsedTime = 0;
  const latticePath = createLatticePath();

  const smoothstep01 = (edge0, edge1, value) => {
    const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  };

  const buildProgram = (nextPresetDef) => {
    const nextProgram = createProgram(gl, FULLSCREEN_VERTEX_SHADER, nextPresetDef.fragmentShader);
    if (program) gl.deleteProgram(program);
    program = nextProgram;
    uniforms = getUniformLocations(gl, program, [
      ...nextPresetDef.uniformNames,
      ...SHADER_AUDIO_UNIFORM_NAMES,
      ...SHADER_AUDIO_BAND_UNIFORM_NAMES,
      ...SHADER_AUDIO_ONSET_UNIFORM_NAMES,
    ]);
    positionLocation = gl.getAttribLocation(program, 'a_position');
    activePresetId = nextPresetDef.id;
  };

  try {
    buildProgram(presetDef);
  } catch (err) {
    console.error('[shader] Failed to build program:', err);
    quad.dispose();
    const stub = failedRenderer();
    stub.dispose = () => quad.dispose();
    return stub;
  }

  const resolveParam = (key, emphasizedFeatures) => {
    const base = presetDef.params[key];
    const reactivity = presetDef.audioReactivity?.[key];
    if (!reactivity) return base;
    const feature = emphasizeShaderAudioFeature(
      emphasizedFeatures[reactivity.source],
      reactivity.gain,
    );
    let value = base + feature * reactivity.amount;
    const range = presetDef.paramRanges?.[key];
    if (range) value = Math.min(range[1], Math.max(range[0], value));
    return value;
  };

  const resolveSpeed = (rawFeatures, warmup) => {
    const base = presetDef.params.speed;
    const reactivity = presetDef.audioReactivity?.speed;
    if (!reactivity) return base;

    const smoothedFeat = emphasizeShaderAudioFeature(speedSmoothedEnergy);
    const rawFeat = emphasizeShaderAudioFeature(rawFeatures.energy);
    const feature = Math.min(
      1,
      Math.max(smoothedFeat, rawFeat * SPEED_RAW_BLEND) + warmup * SPEED_WARMUP_FEATURE,
    );
    let value = base + feature * reactivity.amount;
    const range = presetDef.paramRanges?.speed;
    if (range) value = Math.min(range[1], Math.max(range[0], value));
    return value;
  };

  const renderFrame = ({
    rawFeatures = SILENT_FEATURES,
    deltaMs,
    isPlaying = true,
  }) => {
    if (!gl || !program) return false;

    if (presetDef.id !== activePresetId) {
      buildProgram(presetDef);
    }

    const rawDeltaMs = deltaMs;
    const smoothDeltaMs = Math.min(MAX_FRAME_DELTA_MS, rawDeltaMs);

    smoothedFeatures.bass = smoothToward(
      smoothedFeatures.bass,
      rawFeatures.bass,
      smoothDeltaMs,
      AUDIO_ATTACK_MS,
      AUDIO_RELEASE_MS,
    );
    smoothedFeatures.treble = smoothToward(
      smoothedFeatures.treble,
      rawFeatures.treble,
      smoothDeltaMs,
      AUDIO_ATTACK_MS,
      AUDIO_RELEASE_MS,
    );
    smoothedFeatures.energy = smoothToward(
      smoothedFeatures.energy,
      rawFeatures.energy,
      smoothDeltaMs,
      AUDIO_ATTACK_MS,
      AUDIO_RELEASE_MS,
    );

    const rawBands = rawFeatures.bands;
    for (let i = 0; i < SHADER_FFT_BANDS; i++) {
      const raw = rawBands && i < rawBands.length ? rawBands[i] : 0;
      fastBands[i] = smoothToward(
        fastBands[i],
        raw,
        smoothDeltaMs,
        AUDIO_BAND_ATTACK_MS,
        AUDIO_BAND_RELEASE_MS,
      );
    }
    const drives = resolveShapeBandDrives(fastBands, baseBands);
    const onsets = resolveShapeBandOnsets(fastBands, baseBands);
    for (let i = 0; i < SHADER_FFT_BANDS; i++) {
      uploadBands[i] = drives[i];
      uploadOnsets[i] = onsets[i];
      baseBands[i] = smoothToward(
        baseBands[i],
        fastBands[i],
        smoothDeltaMs,
        AUDIO_BAND_BASE_ATTACK_MS,
        AUDIO_BAND_BASE_RELEASE_MS,
      );
    }

    const rawShape = rawFeatures.waveShape;
    const next = rawShape
      ? [rawShape.sine, rawShape.triangle, rawShape.square, rawShape.saw]
      : SINE_WAVE;
    for (let i = 0; i < SHADER_FFT_BANDS; i++) {
      const shape = waveShapes[i];
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        shape[k] = smoothToward(
          shape[k],
          next[k] || 0,
          smoothDeltaMs,
          WAVE_ATTACK_MS,
          WAVE_RELEASE_MS,
        );
        sum += shape[k];
      }
      if (sum <= 1e-4) {
        shape.set(SINE_WAVE);
      } else {
        for (let k = 0; k < 4; k++) shape[k] /= sum;
      }
    }

    speedSmoothedEnergy = smoothToward(
      speedSmoothedEnergy,
      rawFeatures.energy,
      smoothDeltaMs,
      SPEED_ATTACK_MS,
      AUDIO_RELEASE_MS,
    );

    if (isPlaying) {
      playingMs = Math.min(SPEED_WARMUP_MS * 2, playingMs + smoothDeltaMs);
    } else {
      playingMs = 0;
    }

    const warmup = isPlaying ? 1 - Math.exp(-playingMs / SPEED_WARMUP_MS) : 0;

    const audioBass = emphasizeShaderAudioFeature(smoothedFeatures.bass);
    const audioTreble = emphasizeShaderAudioFeature(smoothedFeatures.treble);
    const audioEnergy = emphasizeShaderAudioFeature(smoothedFeatures.energy);

    const emphasizedFeatures = {
      bass: audioBass,
      treble: audioTreble,
      energy: audioEnergy,
    };

    const speed = resolveSpeed(rawFeatures, warmup);
    const playbackFraction = isPlaying ? 1 : IDLE_SPEED_FRACTION;
    const clockDelta = (rawDeltaMs / 1000) * speed * playbackFraction;
    elapsedTime += clockDelta;

    if (presetDef.id === 'lattice') {
      const high = smoothstep01(0.04, 0.42, uploadBands[7] || 0);
      latticePath.advance(clockDelta * (1.05 + high * 1.35), resolveParam('spacing', emphasizedFeatures));
    }

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return false;

    gl.viewport(0, 0, width, height);
    gl.useProgram(program);

    gl.uniform2f(uniforms.u_resolution, width, height);
    gl.uniform1f(uniforms.u_time, elapsedTime);

    if (uniforms.u_audioBass) gl.uniform1f(uniforms.u_audioBass, audioBass);
    if (uniforms.u_audioTreble) gl.uniform1f(uniforms.u_audioTreble, audioTreble);
    if (uniforms.u_audioEnergy) gl.uniform1f(uniforms.u_audioEnergy, audioEnergy);
    for (let i = 0; i < SHADER_FFT_BANDS; i++) {
      const location = uniforms[SHADER_AUDIO_BAND_UNIFORM_NAMES[i]];
      if (location) gl.uniform1f(location, uploadBands[i]);
      const onsetLocation = uniforms[SHADER_AUDIO_ONSET_UNIFORM_NAMES[i]];
      if (onsetLocation) gl.uniform1f(onsetLocation, uploadOnsets[i]);
      const waveLocation = uniforms[SHADER_WAVE_UNIFORM_NAMES[i]];
      if (waveLocation) {
        const shape = waveShapes[i];
        gl.uniform4f(waveLocation, shape[0], shape[1], shape[2], shape[3]);
      }
    }

    for (const key of Object.keys(presetDef.params)) {
      if (key === 'speed') continue;
      const location = uniforms[`u_${key}`];
      if (location) gl.uniform1f(location, resolveParam(key, emphasizedFeatures));
    }

    for (const key of Object.keys(presetDef.colors)) {
      const location = uniforms[`u_color${capitalize(key)}`];
      if (location) {
        const cycled = resolveCycledColors(presetDef, elapsedTime);
        const [r, g, b] = cycled[key] ?? hexToVec3(presetDef.colors[key]);
        gl.uniform3f(location, r, g, b);
      }
    }

    if (uniforms.u_latticePos) {
      gl.uniform3f(uniforms.u_latticePos, latticePath.pos[0], latticePath.pos[1], latticePath.pos[2]);
    }
    if (uniforms.u_latticeForward) {
      gl.uniform3f(
        uniforms.u_latticeForward,
        latticePath.forward[0],
        latticePath.forward[1],
        latticePath.forward[2],
      );
    }
    if (uniforms.u_latticeUp) {
      gl.uniform3f(uniforms.u_latticeUp, latticePath.up[0], latticePath.up[1], latticePath.up[2]);
    }

    drawFullscreenTriangle(gl, quad.buffer, positionLocation);
    return true;
  };

  return {
    ready: true,
    get elapsedTime() {
      return elapsedTime;
    },
    setPreset(nextPresetId) {
      const next = getShaderPreset(nextPresetId);
      if (next.id === 'lattice' && presetDef.id !== 'lattice') latticePath.reset();
      presetDef = next;
    },
    resetState() {
      elapsedTime = 0;
      playingMs = 0;
      speedSmoothedEnergy = 0;
      fastBands.fill(0);
      baseBands.fill(0);
      for (const shape of waveShapes) shape.set(SINE_WAVE);
      Object.assign(smoothedFeatures, SILENT_FEATURES);
      latticePath.reset();
    },
    renderFrame,
    dispose() {
      if (program) gl.deleteProgram(program);
      quad.dispose();
      program = null;
      quad = null;
      gl = null;
    },
  };
};

/** Convenience for live hook: analyser bytes -> feature bundle.
 *  Frequency bands come from `analyser` (the full mix). The ripple scope
 *  figure is classified from `waveAnalyser` when one is passed, so a lead
 *  can be read without the drums. Otherwise the mix time-domain is used.
 */
export const readShaderAudioFeatures = (analyser, freqDataRef, timeDataRef, waveAnalyser = null) => {
  if (!analyser) return SILENT_FEATURES;
  let freqData = freqDataRef.current;
  if (!freqData || freqData.length !== analyser.frequencyBinCount) {
    freqData = new Uint8Array(analyser.frequencyBinCount);
    freqDataRef.current = freqData;
  }
  analyser.getByteFrequencyData(freqData);
  const features = extractMathAudioFeatures(freqData);
  const waveSource = waveAnalyser || analyser;
  if (!timeDataRef || !waveSource) return features;

  let timeData = timeDataRef.current;
  if (!timeData || timeData.length !== waveSource.fftSize) {
    timeData = new Uint8Array(waveSource.fftSize);
    timeDataRef.current = timeData;
  }
  waveSource.getByteTimeDomainData(timeData);
  features.waveShape = classifyWaveform(timeData);
  return features;
};
