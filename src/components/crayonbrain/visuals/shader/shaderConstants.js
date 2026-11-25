/** Attack/release for smoothing raw FFT features before they drive uniforms.
 *  Tighter attack than other Crayonbrain visualizers so transients read on
 *  a fullscreen procedural pattern; release still long enough to avoid flicker. */
export const AUDIO_ATTACK_MS = 65;
export const AUDIO_RELEASE_MS = 230;

/** Faster attack used only for the animation clock (`speed` param) so the
 *  "sped up" feel kicks in shortly after playback starts. */
export const SPEED_ATTACK_MS = 22;

/** Wall-clock ms after play starts over which a warmup boost is blended into
 *  speed — reaches ~63% at half this value, ~95% at full duration. */
export const SPEED_WARMUP_MS = 900;

/** Extra emphasized-energy headroom added to `speed` during warmup (0..1 scale). */
export const SPEED_WARMUP_FEATURE = 0.5;

/** Raw emphasized energy blended into speed resolve for instant punch on hits. */
export const SPEED_RAW_BLEND = 0.82;

/** Per-feature gain applied before the emphasize curve — lifts typical
 *  playback levels (often 0.1–0.4 raw) into a useful modulation range. */
export const AUDIO_FEATURE_GAIN = 1.7;

/** Exponential emphasize curve — quiet passages stay calm, peaks punch harder. */
export const AUDIO_EMPHASIZE_GAIN = 1.6;

/** Fast envelope on each FFT band. Short so a hit is not smeared a second time
 *  after the analyser. */
export const AUDIO_BAND_ATTACK_MS = 20;
export const AUDIO_BAND_RELEASE_MS = 100;

/** Slow baseline under each band. The drive flashes by the amount the fast
 *  envelope sits above this. */
export const AUDIO_BAND_BASE_ATTACK_MS = 460;
export const AUDIO_BAND_BASE_RELEASE_MS = 720;

/** When playback is stopped, the pattern keeps drifting at this fraction of
 *  its speed rather than freezing dead — reads as "idling", not "broken". */
export const IDLE_SPEED_FRACTION = 0.18;

/** Largest per-frame delta accepted for the animation clock, so a tab-switch
 *  stall doesn't cause the pattern to jump/tear on the next frame. */
export const MAX_FRAME_DELTA_MS = 100;
