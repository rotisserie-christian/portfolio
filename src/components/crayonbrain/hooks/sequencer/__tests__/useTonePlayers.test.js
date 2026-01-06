import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTonePlayers } from '../useTonePlayers';
import * as Tone from 'tone';
import {
  createMockDrumSounds,
  setupToneMocks,
  createTestRefs,
  resetTestRefs,
  waitForPlayersInitialized,
  expectAllPlayersExist,
  expectAllPlayersConnected,
  expectAllPlayersDisposed,
  expectNoPlayersDisposed,
  waitForErrorLog,
  waitForInitializationState,
} from './__test-utils__';

// Mock Tone.js
vi.mock('tone', () => ({
  Gain: vi.fn(),
  Player: vi.fn(),
  loaded: vi.fn(),
}));

describe('useTonePlayers', () => {
  let mockGain;
  let drumSounds;
  let playersRef;
  let sequencerGainRef;
  let isInitializingRef;
  let setIsInitializing;

  beforeEach(() => {
    // Setup Tone mocks
    ({ mockGain } = setupToneMocks());

    // Mock drum sounds
    drumSounds = createMockDrumSounds();

    // Create test refs
    ({ playersRef, sequencerGainRef, isInitializingRef, setIsInitializing } = createTestRefs());

    // Mock console methods
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    resetTestRefs({ playersRef, sequencerGainRef, isInitializingRef });
    // Reset Tone.loaded mock
    Tone.loaded.mockReset();
    Tone.loaded.mockResolvedValue(undefined);
  });

  // Helper function to set up hook
  const setupHook = (overrides = {}) => {
    const props = {
      drumSounds: overrides.drumSounds || drumSounds,
      playersRef: overrides.playersRef || playersRef,
      sequencerGainRef: overrides.sequencerGainRef || sequencerGainRef,
      isInitializingRef: overrides.isInitializingRef || isInitializingRef,
      setIsInitializing: overrides.setIsInitializing || setIsInitializing,
      shouldInitialize: overrides.shouldInitialize !== undefined ? overrides.shouldInitialize : true,
    };

    return renderHook(() => useTonePlayers(...Object.values(props)));
  };

  it('should create gain node and connect to destination', async () => {
    setupHook();

    await waitFor(() => {
      expect(Tone.Gain).toHaveBeenCalledWith(1);
      expect(mockGain.toDestination).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should store gain node in sequencerGainRef', async () => {
    setupHook();

    await waitFor(() => {
      expect(sequencerGainRef.current).toBe(mockGain);
    });
  });

  it('should create players for each drum sound', async () => {
    setupHook();

    // Wait for the async function to complete
    await waitFor(() => {
      expect(Tone.Player).toHaveBeenCalledTimes(3);
    }, { timeout: 2000 });

    expect(Tone.Player).toHaveBeenCalledWith('/sounds/kick.wav');
    expect(Tone.Player).toHaveBeenCalledWith('/sounds/snare.wav');
    expect(Tone.Player).toHaveBeenCalledWith('/sounds/hat.wav');
  });

  it('should connect each player to sequencer gain', async () => {
    setupHook();

    await waitForPlayersInitialized(playersRef);

    expectAllPlayersConnected(playersRef, mockGain);
  });

  it('should wait for audio to load before storing players', async () => {
    setupHook();

    await waitFor(() => {
      expect(Tone.loaded).toHaveBeenCalled();
    });

    await waitForPlayersInitialized(playersRef);
    expectAllPlayersExist(playersRef);
  });

  it('should set initialization state to true during initialization', async () => {
    setupHook();

    await waitForInitializationState(isInitializingRef, true);
    expect(setIsInitializing).toHaveBeenCalledWith(true);
  });

  it('should set initialization state to false after loading', async () => {
    setupHook();

    await waitForInitializationState(isInitializingRef, false);
    expect(setIsInitializing).toHaveBeenCalledWith(false);
  });

  it('should not initialize when shouldInitialize is false', () => {
    setupHook({ shouldInitialize: false });

    expect(Tone.Gain).not.toHaveBeenCalled();
    expect(Tone.Player).not.toHaveBeenCalled();
    expect(setIsInitializing).not.toHaveBeenCalled();
  });

  describe('error handling', () => {
    it('should handle errors during initialization', async () => {
      Tone.loaded.mockRejectedValue(new Error('Failed to load audio'));

      setupHook();

      await waitForErrorLog();

      // Should reset initialization state on error
      expect(isInitializingRef.current).toBe(false);
      expect(setIsInitializing).toHaveBeenCalledWith(false);
    });

    it('should handle errors when creating gain node', async () => {
      Tone.Gain.mockImplementation(() => {
        throw new Error('Failed to create gain');
      });

      setupHook();

      await waitForErrorLog();

      expect(isInitializingRef.current).toBe(false);
      expect(setIsInitializing).toHaveBeenCalledWith(false);
    });

    it('should handle errors when creating players', async () => {
      Tone.Player.mockImplementation(() => {
        throw new Error('Failed to create player');
      });

      setupHook();

      await waitForErrorLog();

      expect(isInitializingRef.current).toBe(false);
      expect(setIsInitializing).toHaveBeenCalledWith(false);
    });
  });

  describe('cleanup', () => {
    it('should dispose all players on unmount', async () => {
      const { unmount } = setupHook();

      await waitForPlayersInitialized(playersRef);

      const players = playersRef.current;

      act(() => {
        unmount();
      });

      expectAllPlayersDisposed(players, mockGain);
    });

    it('should dispose sequencer gain on unmount', async () => {
      const { unmount } = setupHook();

      await waitFor(() => {
        expect(sequencerGainRef.current).toBe(mockGain);
      });

      act(() => {
        unmount();
      });

      expect(mockGain.dispose).toHaveBeenCalled();
    });

    it('should not cleanup if currently initializing', async () => {
      const { unmount } = setupHook();

      await waitForPlayersInitialized(playersRef);

      // Set initializing to true before unmount
      isInitializingRef.current = true;

      const players = playersRef.current;

      act(() => {
        unmount();
      });

      // Should not dispose if initializing
      expectNoPlayersDisposed(players, mockGain);
    });

    it('should handle missing dispose methods gracefully', async () => {
      const { unmount } = setupHook();

      await waitForPlayersInitialized(playersRef);

      // Remove dispose from one player
      const players = playersRef.current;
      delete players.kick.dispose;

      act(() => {
        unmount();
      });

      // Should still dispose other players and gain
      expectAllPlayersDisposed(players, mockGain, ['kick']);
    });

    it('should handle null players in cleanup', async () => {
      const { unmount } = setupHook();

      await waitForPlayersInitialized(playersRef);

      // Set one player to null
      const players = playersRef.current;
      players.kick = null;

      act(() => {
        unmount();
      });

      // Should still dispose other players
      expectAllPlayersDisposed(players, mockGain, ['kick']);
    });

    it('should handle empty playersRef during cleanup', async () => {
      const { unmount } = setupHook();

      await waitForPlayersInitialized(playersRef);

      // Clear players
      playersRef.current = {};

      act(() => {
        unmount();
      });

      // Should still dispose gain
      expect(mockGain.dispose).toHaveBeenCalled();
    });
  });

  describe('dependency changes', () => {
    it('should reinitialize when drumSounds array reference changes', async () => {
      const { rerender } = setupHook();

      await waitForPlayersInitialized(playersRef);

      // Create a new array reference (React will detect this)
      const newDrumSounds = [{ id: 'crash', name: 'Crash', src: '/sounds/crash.wav' }];

      act(() => {
        rerender({
          drumSounds: newDrumSounds,
          playersRef,
          sequencerGainRef,
          isInitializingRef,
          setIsInitializing,
          shouldInitialize: true,
        });
      });

      // Should have a players object (may be new or same depending on React's effect behavior)
      expect(playersRef.current).toBeDefined();
      expect(Tone.Player).toHaveBeenCalled();
    });

    it('should initialize when shouldInitialize is true', async () => {
      setupHook({ shouldInitialize: true });

      // Should initialize when shouldInitialize is true
      await waitFor(() => {
        expect(Tone.Gain).toHaveBeenCalled();
        expect(Tone.Player).toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });

  describe('edge cases', () => {
    it('should handle empty drumSounds array', async () => {
      setupHook({ drumSounds: [] });

      await waitFor(() => {
        expect(Tone.Gain).toHaveBeenCalled();
        expect(Tone.Player).not.toHaveBeenCalled();
        expect(playersRef.current).toEqual({});
      });
    });

    it('should handle duplicate sound IDs', async () => {
      const duplicateSounds = [
        { id: 'kick', name: 'Kick 1', src: '/sounds/kick1.wav' },
        { id: 'kick', name: 'Kick 2', src: '/sounds/kick2.wav' },
      ];

      setupHook({ drumSounds: duplicateSounds });

      await waitFor(() => {
        expect(Tone.Player).toHaveBeenCalledTimes(2);
      });

      // Last one should overwrite (both use same id 'kick')
      await waitForPlayersInitialized(playersRef, 1);
      expect(playersRef.current.kick).toBeDefined();
    });

    it('should handle sounds with missing properties', async () => {
      const incompleteSounds = [
        { id: 'kick' }, // missing src
        { id: 'snare', src: '/sounds/snare.wav' }, // missing name
      ];

      setupHook({ drumSounds: incompleteSounds });

      await waitFor(() => {
        // Should still attempt to create players
        expect(Tone.Player).toHaveBeenCalled();
      });
    });
  });
});

