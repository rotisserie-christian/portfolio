/**
 * Low-level WebGL context helpers, shared by every GL-based Crayonbrain
 * sub-visualizer (currently `shader/`, intended for reuse by future ones —
 * e.g. a WebGL rewrite of the Spectrogram 3D surface).
 */

const CONTEXT_OPTIONS = {
  alpha: false,
  antialias: true,
  premultipliedAlpha: false,
  preserveDrawingBuffer: false,
  powerPreference: 'low-power',
};

/**
 * Acquire a WebGL2 context, falling back to WebGL1. Returns null if neither
 * is available so callers can render a static fallback instead of crashing.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {Object} [options] merged over default CONTEXT_OPTIONS
 * @returns {{ gl: WebGLRenderingContext | WebGL2RenderingContext, isWebGL2: boolean } | null}
 */
export const createWebGLContext = (canvas, options = {}) => {
  const contextOptions = { ...CONTEXT_OPTIONS, ...options };
  const gl2 = canvas.getContext('webgl2', contextOptions);
  if (gl2) return { gl: gl2, isWebGL2: true };

  const gl1 =
    canvas.getContext('webgl', contextOptions) ||
    canvas.getContext('experimental-webgl', contextOptions);
  if (gl1) return { gl: gl1, isWebGL2: false };

  return null;
};

/**
 * Wires the standard WebGL context-loss lifecycle. The browser can drop a
 * context at any time (GPU reset, too many contexts, tab backgrounding on
 * some platforms); losing it silently would freeze the canvas on its last
 * frame forever, so callers must stop their RAF loop on loss and rebuild
 * everything (program, buffers, uniform locations) on restore.
 *
 * @returns {() => void} cleanup function to remove the listeners
 */
export const attachContextLossHandlers = (canvas, { onLost, onRestored }) => {
  const handleLost = (event) => {
    event.preventDefault();
    onLost?.();
  };
  const handleRestored = () => {
    onRestored?.();
  };

  canvas.addEventListener('webglcontextlost', handleLost, false);
  canvas.addEventListener('webglcontextrestored', handleRestored, false);

  return () => {
    canvas.removeEventListener('webglcontextlost', handleLost, false);
    canvas.removeEventListener('webglcontextrestored', handleRestored, false);
  };
};
