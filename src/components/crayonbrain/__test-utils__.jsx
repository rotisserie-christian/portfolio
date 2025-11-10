import { vi } from 'vitest';
import { SequencerProvider } from '../../contexts/SequencerContext.jsx';

/**
 * Wrapper component for SequencerProvider
 */
export const wrapperWithSequencerProvider = ({ children }) => (
  <SequencerProvider>{children}</SequencerProvider>
);

/**
 * Creates mock sequencer context value
 */
export const createMockSequencerContext = (overrides = {}) => ({
  isPlaying: false,
  setIsPlaying: vi.fn(),
  sequencerGainRef: { current: null },
  ...overrides,
});

/**
 * Mocks useSequencer hook
 */
export const createMockUseSequencer = (overrides = {}) => ({
  isPlaying: false,
  currentStep: 0,
  handlePlay: vi.fn(),
  sequencerGainRef: { current: null },
  isInitializing: false,
  ...overrides,
});

/**
 * Mocks useIntersectionObserver hook
 */
export const createMockUseIntersectionObserver = (overrides = {}) => ({
  elementRef: { current: null },
  isIntersecting: false,
  hasIntersected: true, // Default to true for most tests
  ...overrides,
});

/**
 * Mocks useVisualizer hook
 */
export const createMockUseVisualizer = (overrides = {}) => ({
  visualizerRef: { current: null },
  analyserRef: { current: null },
  presetsRef: { current: null },
  ...overrides,
});

/**
 * Mocks usePresetSwitching hook
 */
export const createMockUsePresetSwitching = (overrides = {}) => ({
  currentPresetSelection: 0,
  presetName: 'Test Preset',
  switchPreset: vi.fn(),
  ...overrides,
});

/**
 * Creates mock IntersectionObserver
 */
export const createMockIntersectionObserver = () => {
  const mockObserve = vi.fn();
  const mockDisconnect = vi.fn();
  
  global.IntersectionObserver = vi.fn(() => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
  }));
  
  return { mockObserve, mockDisconnect };
};

/**
 * Creates mock canvas element with getContext
 */
export const createMockCanvas = () => {
  const canvas = document.createElement('canvas');
  const mockGetContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Array(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => []),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  }));
  
  canvas.getContext = mockGetContext;
  return { canvas, mockGetContext };
};

/**
 * Creates mock drum sequence for testing
 */
export const createMockDrumSequence = () => [
  { steps: [true, false, false, false, false, true, false, false] },
  { steps: [false, false, true, false, false, false, true, false] },
  { steps: [false, false, false, false, false, false, false, false] },
  { steps: [true, false, false, false, true, false, false, false] },
];

/**
 * Creates mock drum sounds for testing
 */
export const createMockDrumSounds = () => [
  { id: 'kick', name: 'Kick', src: '/mock/kick.wav' },
  { id: 'snare', name: 'Snare', src: '/mock/snare.wav' },
  { id: 'snare2', name: 'Snare2', src: '/mock/snare2.wav' },
  { id: 'hat', name: 'Hat', src: '/mock/hat.wav' },
];

