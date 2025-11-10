import { vi } from 'vitest';

/**
 * Sets up device pixel ratio mock
 * @param {number} dpr - Device pixel ratio value to set (default: 1)
 * @returns {number} Original device pixel ratio value (for restoration)
 */
export const setupDevicePixelRatio = (dpr = 1) => {
  const original = window?.devicePixelRatio || 1;
  if (window) {
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: dpr,
    });
  }
  return original;
};

/**
 * Restores device pixel ratio to original value
 * @param {number} originalDpr - Original device pixel ratio value
 */
export const restoreDevicePixelRatio = (originalDpr) => {
  if (window) {
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: originalDpr,
    });
  }
};

/**
 * Creates a mock canvas element
 * @param {Object} options - Configuration options
 * @param {number} options.width - Canvas width (default: 800)
 * @param {number} options.height - Canvas height (default: 600)
 * @returns {Object} Mock canvas element
 */
export const createMockCanvas = ({
  width = 800,
  height = 600,
} = {}) => {
  const canvas = {
    width: 0,
    height: 0,
    getBoundingClientRect: vi.fn(() => ({
      width,
      height,
    })),
  };
  return canvas;
};

/**
 * Creates a mock visualizer instance
 * @param {Object} options - Configuration options
 * @param {boolean} options.withConnectAudio - Whether visualizer should have connectAudio method
 * @param {boolean} options.withDisconnect - Whether visualizer should have disconnect method
 * @param {boolean} options.withSetRendererSize - Whether visualizer should have setRendererSize method
 * @param {boolean} options.withRender - Whether visualizer should have render method
 * @returns {Object} Mock visualizer instance
 */
export const createMockVisualizer = ({
  withConnectAudio = true,
  withDisconnect = true,
  withSetRendererSize = false,
  withRender = false,
} = {}) => {
  const visualizer = {};
  
  if (withConnectAudio) {
    visualizer.connectAudio = vi.fn();
  }
  
  if (withDisconnect) {
    visualizer.disconnect = vi.fn();
  }
  
  if (withSetRendererSize) {
    visualizer.setRendererSize = vi.fn();
  }
  
  if (withRender) {
    visualizer.render = vi.fn();
  }
  
  if (withConnectAudio) {
    visualizer.loadPreset = vi.fn();
  }
  
  return visualizer;
};

/**
 * Creates mock presets object
 * @param {Object} options - Configuration options
 * @param {number} options.totalPresets - Total number of presets to create (default: 78)
 * @returns {Object} Mock presets object
 */
export const createMockPresets = ({
  totalPresets = 78,
} = {}) => {
  const presetKeys = Array(totalPresets).fill(null).map((_, i) => `Preset ${i}`);
  
  const presets = {};
  presetKeys.forEach((key, index) => {
    presets[key] = { data: `preset${index}` };
  });
  
  return presets;
};

/**
 * Creates a minimal mock presets object with only specified indices
 * @param {Array<number>} indices - Array of preset indices to include
 * @returns {Object} Mock presets object with only specified presets
 */
export const createMockPresetsMinimal = (indices = [0, 54, 77]) => {
  const presets = {};
  indices.forEach((index) => {
    presets[`Preset ${index}`] = { data: `preset${index}` };
  });
  return presets;
};

/**
 * Creates a mock audio context
 * @param {Object} options - Configuration options
 * @param {boolean} options.withCreateAnalyser - Whether context should have createAnalyser method
 * @returns {Object} Mock audio context
 */
export const createMockAudioContext = ({
  withCreateAnalyser = true,
} = {}) => {
  const audioContext = {};
  
  if (withCreateAnalyser) {
    audioContext.createAnalyser = vi.fn();
  }
  
  return audioContext;
};

/**
 * Creates a mock analyser node
 * @param {Object} options - Configuration options
 * @param {number} options.fftSize - FFT size value (default: 2048)
 * @param {number} options.smoothingTimeConstant - Smoothing time constant (default: 0.2)
 * @param {boolean} options.withConnect - Whether analyser should have connect method
 * @param {boolean} options.withDisconnect - Whether analyser should have disconnect method
 * @returns {Object} Mock analyser node
 */
export const createMockAnalyser = ({
  fftSize = 2048,
  smoothingTimeConstant = 0.2,
  withConnect = false,
  withDisconnect = false,
} = {}) => {
  const analyser = {
    fftSize,
    smoothingTimeConstant,
  };
  
  if (withConnect) {
    analyser.connect = vi.fn();
  }
  
  if (withDisconnect) {
    analyser.disconnect = vi.fn();
  }
  
  return analyser;
};

/**
 * Creates a mock Web Audio API gain node
 * @param {Object} options - Configuration options
 * @param {boolean} options.withConnect - Whether gain should have connect method
 * @param {boolean} options.withDisconnect - Whether gain should have disconnect method
 * @param {boolean} options.withToDestination - Whether gain should have toDestination method
 * @returns {Object} Mock Web Audio API gain node
 */
export const createMockGainNode = ({
  withConnect = true,
  withDisconnect = true,
  withToDestination = false,
} = {}) => {
  const gain = {};
  
  if (withConnect) {
    gain.connect = vi.fn(function() {
      return this; // Allow chaining
    });
  }
  
  if (withDisconnect) {
    gain.disconnect = vi.fn();
  }
  
  if (withToDestination) {
    gain.toDestination = vi.fn();
  }
  
  return gain;
};

/**
 * Sets up requestAnimationFrame mocks
 * @returns {Object} Object containing rafId counter and frame callback storage
 */
export const setupRequestAnimationFrame = () => {
  let rafId = 1;
  let frameCallback = null;
  
  // eslint-disable-next-line no-undef
  global.requestAnimationFrame = vi.fn((cb) => {
    frameCallback = cb;
    return rafId++;
  });
  
  // eslint-disable-next-line no-undef
  const cancelAnimationFrameSpy = vi.spyOn(global, 'cancelAnimationFrame').mockImplementation(() => {});
  
  return {
    rafId: () => rafId,
    getFrameCallback: () => frameCallback,
    cancelAnimationFrameSpy,
    triggerFrame: () => {
      if (frameCallback) {
        frameCallback();
      }
    },
  };
};

/**
 * Stubs import.meta.env.MODE for testing
 * @param {string} mode - Environment mode ('development' | 'production')
 */
export const stubEnvironmentMode = (mode = 'development') => {
  vi.stubGlobal('import', {
    meta: {
      env: {
        MODE: mode,
      },
    },
  });
};

/**
 * Creates test refs for visualizer hooks
 * @returns {Object} Object containing common refs used in visualizer tests
 */
export const createTestRefs = () => {
  return {
    canvasRef: { current: null },
    visualizerRef: { current: null },
    analyserRef: { current: null },
    audioCtxRef: { current: null },
    presetsRef: { current: null },
    connectedGainRef: { current: null },
  };
};

/**
 * Resets test refs to initial state
 * @param {Object} refs - Object containing refs to reset
 */
export const resetTestRefs = (refs) => {
  if (refs.canvasRef) refs.canvasRef.current = null;
  if (refs.visualizerRef) refs.visualizerRef.current = null;
  if (refs.analyserRef) refs.analyserRef.current = null;
  if (refs.audioCtxRef) refs.audioCtxRef.current = null;
  if (refs.presetsRef) refs.presetsRef.current = null;
  if (refs.connectedGainRef) refs.connectedGainRef.current = null;
};

/**
 * Sets up window event listener spies for testing
 * @returns {Object} Object containing addEventListener and removeEventListener spies
 */
export const setupWindowEventListeners = () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  
  return {
    addEventListenerSpy,
    removeEventListenerSpy,
  };
};

/**
 * Sets up addEventListener spy to capture resize handler
 * @param {Function} addEventListenerSpy - Spy on window.addEventListener
 * @returns {Function} Function that returns the captured resize handler
 */
export const captureResizeHandler = (addEventListenerSpy) => {
  let resizeHandler = null;
  addEventListenerSpy.mockImplementation((event, handler) => {
    if (event === 'resize') {
      resizeHandler = handler;
    }
  });
  return () => resizeHandler;
};

