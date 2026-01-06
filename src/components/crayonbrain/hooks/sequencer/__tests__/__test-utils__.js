import { vi, expect } from 'vitest';
import { waitFor, act } from '@testing-library/react';
import * as Tone from 'tone';

/**
 * Creates standard mock drum sounds for testing
 * @returns {Array} Array of drum sound objects
 */
export const createMockDrumSounds = () => [
  { id: 'kick', name: 'Kick', src: '/sounds/kick.wav' },
  { id: 'snare', name: 'Snare', src: '/sounds/snare.wav' },
  { id: 'hat', name: 'Hi-Hat', src: '/sounds/hat.wav' },
];

/**
 * Creates mock drum sounds without src (for useToneSequence)
 * @returns {Array} Array of drum sound objects with only id
 */
export const createMockDrumSoundsMinimal = () => [
  { id: 'kick' },
  { id: 'snare' },
  { id: 'hat' },
];

/**
 * Creates standard mock players for testing
 * @param {Object} options - Configuration options
 * @param {boolean} options.withStart - Whether players should have start method
 * @param {boolean} options.withConnect - Whether players should have connect method
 * @param {boolean} options.withDispose - Whether players should have dispose method
 * @param {boolean} options.loaded - Whether players should be marked as loaded
 * @returns {Object} Object with kick, snare, hat player mocks
 */
export const createMockPlayers = ({
  withStart = false,
  withConnect = false,
  withDispose = false,
  loaded = true,
} = {}) => {
  const createPlayer = () => {
    const player = {};
    if (withStart) {
      player.start = vi.fn();
    }
    if (withConnect) {
      player.connect = vi.fn(function() {
        return this; // Allow chaining
      });
    }
    if (withDispose) {
      player.dispose = vi.fn();
    }
    if (loaded) {
      player.loaded = true;
    }
    return player;
  };

  return {
    kick: createPlayer(),
    snare: createPlayer(),
    hat: createPlayer(),
  };
};

/**
 * Creates standard mock drum sequence pattern for testing
 * @returns {Array} Array of track objects with step patterns
 */
export const createMockDrumSequence = () => [
  {
    steps: [true, false, false, false, true, false, false, false], // kick pattern
  },
  {
    steps: [false, false, true, false, false, false, true, false], // snare pattern
  },
  {
    steps: [true, true, true, true, true, true, true, true], // hat pattern
  },
];

/**
 * Creates a mock gain node 
 * @returns {Object} Mock gain node
 */
export const createMockGain = () => ({
  toDestination: vi.fn(),
  dispose: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
});

/**
 * Creates a mock sequence 
 * @returns {Object} Mock sequence
 */
export const createMockSequence = () => ({
  start: vi.fn(),
  stop: vi.fn(),
  dispose: vi.fn(),
});

/**
 * Creates a mock transport
 * @param {Object} options - Configuration options
 * @param {string} options.state - Transport state ('stopped' | 'started')
 * @param {number} options.bpm - Initial BPM value (default: 120)
 * @returns {Object} Mock transport
 */
export const createMockTransport = ({ state = 'stopped', bpm = 120 } = {}) => ({
  state,
  bpm: {
    value: bpm,
  },
  start: vi.fn(),
  stop: vi.fn(),
});

/**
 * Tone.js mocks for useTonePlayers tests
 * @returns {Object} Object containing mockGain
 */
export const setupToneMocks = () => {
  const mockGain = createMockGain();
  
  Tone.Gain.mockImplementation(() => mockGain);
  
  Tone.Player.mockImplementation(() => {
    const player = {
      connect: vi.fn(function() {
        return this; // Allow chaining
      }),
      dispose: vi.fn(),
    };
    return player;
  });
  
  Tone.loaded.mockReset();
  Tone.loaded.mockResolvedValue(undefined);
  
  return { mockGain };
};

/**
 * Creates test refs for useTonePlayers tests
 * @returns {Object} Object containing playersRef, sequencerGainRef, isInitializingRef, setIsInitializing
 */
export const createTestRefs = () => {
  const playersRef = { current: {} };
  const sequencerGainRef = { current: null };
  const isInitializingRef = { current: false };
  const setIsInitializing = vi.fn();
  
  return { playersRef, sequencerGainRef, isInitializingRef, setIsInitializing };
};

/**
 * Resets test refs to initial state
 * @param {Object} refs - Object containing playersRef, sequencerGainRef, isInitializingRef
 */
export const resetTestRefs = (refs) => {
  refs.playersRef.current = {};
  refs.sequencerGainRef.current = null;
  refs.isInitializingRef.current = false;
};

/**
 * Waits for players to be initialized
 * @param {Object} playersRef - React ref containing players
 * @param {number} expectedCount - Expected number of players (default: 3)
 * @param {Object} options - waitFor options
 */
export const waitForPlayersInitialized = async (playersRef, expectedCount = 3, options = {}) => {
  await waitFor(() => {
    expect(playersRef.current).toBeDefined();
    expect(Object.keys(playersRef.current)).toHaveLength(expectedCount);
  }, options);
};

/**
 * All expected players exist
 * @param {Object} playersRef - React ref containing players
 * @param {Array<string>} playerIds - Array of player IDs to check (default: ['kick', 'snare', 'hat'])
 */
export const expectAllPlayersExist = (playersRef, playerIds = ['kick', 'snare', 'hat']) => {
  expect(playersRef.current).toBeDefined();
  playerIds.forEach(id => {
    expect(playersRef.current[id]).toBeDefined();
  });
};

/**
 * All players are connected to the gain node
 * @param {Object} playersRef - React ref containing players
 * @param {Object} mockGain - Mock gain node
 * @param {Array<string>} playerIds - Array of player IDs to check (default: ['kick', 'snare', 'hat'])
 */
export const expectAllPlayersConnected = (playersRef, mockGain, playerIds = ['kick', 'snare', 'hat']) => {
  playerIds.forEach(id => {
    expect(playersRef.current[id].connect).toHaveBeenCalledWith(mockGain);
  });
};

/**
 * All players and gain are disposed
 * @param {Object} players - Object containing player instances
 * @param {Object} mockGain - Mock gain node
 * @param {Array<string>} excludeIds - Player IDs to exclude from disposal check
 */
export const expectAllPlayersDisposed = (players, mockGain, excludeIds = []) => {
  Object.entries(players).forEach(([id, player]) => {
    if (!excludeIds.includes(id) && player?.dispose) {
      expect(player.dispose).toHaveBeenCalled();
    }
  });
  if (mockGain) {
    expect(mockGain.dispose).toHaveBeenCalled();
  }
};

/**
 * Players and gain are not disposed
 * @param {Object} players - Object containing player instances
 * @param {Object} mockGain - Mock gain node
 * @param {Array<string>} playerIds - Player IDs to check (default: ['kick', 'snare', 'hat'])
 */
export const expectNoPlayersDisposed = (players, mockGain, playerIds = ['kick', 'snare', 'hat']) => {
  playerIds.forEach(id => {
    if (players[id]?.dispose) {
      expect(players[id].dispose).not.toHaveBeenCalled();
    }
  });
  if (mockGain) {
    expect(mockGain.dispose).not.toHaveBeenCalled();
  }
};

/**
 * Waits for error to be logged to console
 * @param {string} errorMessage - Expected error message prefix
 * @param {Object} options - waitFor options
 */
export const waitForErrorLog = async (errorMessage = 'Error initializing audio:', options = {}) => {
  await waitFor(() => {
    expect(console.error).toHaveBeenCalledWith(
      errorMessage,
      expect.any(Error)
    );
  }, options);
};

/**
 * Waits for initialization state to be set
 * @param {Object} isInitializingRef - React ref for initialization state
 * @param {boolean} expectedValue - Expected initialization state
 * @param {Object} options - waitFor options
 */
export const waitForInitializationState = async (isInitializingRef, expectedValue, options = {}) => {
  await waitFor(() => {
    expect(isInitializingRef.current).toBe(expectedValue);
  }, options);
};

/**
 * Waits for warning to be logged to console
 * @param {string} warnMessage - Expected warning message (exact match or partial)
 * @param {Object} options - waitFor options
 * @param {boolean} options.expectError - Whether to expect an Error as second argument
 */
export const waitForWarnLog = async (warnMessage, options = {}) => {
  const { expectError, ...waitForOptions } = options;
  await waitFor(() => {
    if (expectError) {
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(warnMessage),
        expect.any(Error)
      );
    } else {
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(warnMessage)
      );
    }
  }, waitForOptions);
};

/**
 * Calls a hook result function within act
 * @param {Function} hookResult - The result.current function from renderHook
 * @returns {Promise} Promise that resolves when the hook result is called
 */
export const callHookResult = async (hookResult) => {
  await act(async () => {
    await hookResult();
  });
};

/**
 * Invokes a sequence callback within act
 * @param {Function} sequenceCallback - The sequence callback function
 * @param {number} time - Time value to pass to callback
 * @param {number} step - Step index to pass to callback
 */
export const invokeSequenceCallback = (sequenceCallback, time, step) => {
  act(() => {
    sequenceCallback(time, step);
  });
};

/**
 * Asserts that a sequence was properly disposed
 * @param {Object} sequenceInstance - The sequence instance
 * @param {Object} sequenceRef - React ref containing the sequence
 */
export const expectSequenceDisposed = (sequenceInstance, sequenceRef) => {
  expect(sequenceInstance.stop).toHaveBeenCalled();
  expect(sequenceInstance.dispose).toHaveBeenCalled();
  expect(sequenceRef.current).toBeNull();
};

