import { vi } from 'vitest';
import {
  createMockAudioContext,
  createMockGainNode,
  createMockAnalyser,
} from '../components/crayonbrain/hooks/visualizer/__tests__/__test-utils__';

/**
 * Sets up comprehensive Tone.js mocks for integration tests
 * Covers both useSequencer and useVisualizer 
 * 
 * Note: Tone.js must be mocked at the top level in the test file
 * 
 * @param {Object} Tone - The mocked Tone module (from vi.mock)
 * @returns {Object} Object containing all mock audio nodes and Tone.js setup
 */
export const setupIntegrationToneMocks = (Tone) => {
  const mockGainNode = createMockGainNode({ withToDestination: true });
  mockGainNode.dispose = vi.fn();
  const mockAnalyser = createMockAnalyser();
  const mockMasterGain = { 
    connect: vi.fn(),
  };
  
  // Create audio context with createAnalyser that returns the mock analyser
  const mockAudioContext = createMockAudioContext();
  mockAudioContext.createAnalyser.mockReturnValue(mockAnalyser);
  mockAudioContext.createGain = vi.fn(() => mockGainNode);
  mockAudioContext.createMediaStreamDestination = vi.fn(() => ({
    connect: vi.fn(),
  }));
  
  const mockTransport = {
    state: 'stopped',
    bpm: { 
      value: 120,
    },
    start: vi.fn(() => {
      mockTransport.state = 'started';
    }),
    stop: vi.fn(() => {
      mockTransport.state = 'stopped';
    }),
  };

  // Setup Tone.js mocks 
  const mockToneContext = {
    rawContext: mockAudioContext,
    state: 'running',
  };

  Tone.getContext.mockReturnValue(mockToneContext);

  Tone.getDestination.mockReturnValue({
    input: mockMasterGain,
  });

  Tone.start.mockResolvedValue(undefined);

  // Sequencer-specific mocks
  Tone.Gain.mockImplementation(() => mockGainNode);
  
  Tone.Player.mockImplementation(() => ({
    connect: vi.fn(function() {
      return this; // Allow chaining
    }),
    dispose: vi.fn(),
    loaded: true,
    start: vi.fn(),
  }));
  
  Tone.Sequence.mockImplementation((callback, steps, subdivision) => ({
    start: vi.fn(),
    stop: vi.fn(),
    dispose: vi.fn(),
    callback,
    steps,
    subdivision,
  }));
  
  Tone.getTransport.mockReturnValue(mockTransport);
  Tone.loaded.mockResolvedValue(undefined);

  return {
    mockAudioContext,
    mockGainNode,
    mockAnalyser,
    mockMasterGain,
    mockTransport,
    mockToneContext,
  };
};

/**
 * Cleans up Tone.js mocks after tests
 */
export const cleanupToneMocks = () => {
  vi.clearAllMocks();
};

