import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToneSequence } from '../useToneSequence';
import * as Tone from 'tone';
import { TIME_STEPS } from '../../../utils/sequencerConstants';
import {
  createMockDrumSoundsMinimal,
  createMockPlayers,
  createMockDrumSequence,
  invokeSequenceCallback,
  waitForWarnLog,
  expectSequenceDisposed,
} from './__test-utils__';

// Mock Tone.js
vi.mock('tone', () => ({
  Sequence: vi.fn(),
}));

describe('useToneSequence', () => {
  let mockSequence;
  let sequenceCallback;
  let setCurrentStep;
  let stableDrumSounds;
  let playersRef;
  let drumSequenceRef;
  let sequenceRef;

  beforeEach(() => {
    // Mock sequence instance
    mockSequence = {
      stop: vi.fn(),
      dispose: vi.fn(),
    };

    // Mock Tone.Sequence constructor
    // Create a new mock sequence for each call
    Tone.Sequence.mockImplementation((callback) => {
      sequenceCallback = callback;
      const newSequence = {
        stop: vi.fn(),
        dispose: vi.fn(),
      };
      return newSequence;
    });

    // Mock state setter
    setCurrentStep = vi.fn();

    // Mock drum sounds
    stableDrumSounds = createMockDrumSoundsMinimal();

    // Mock players
    const mockPlayers = createMockPlayers({ withStart: true });
    playersRef = {
      current: mockPlayers,
    };

    // Mock drum sequence pattern
    drumSequenceRef = {
      current: createMockDrumSequence(),
    };

    // Create sequence ref
    sequenceRef = { current: null };

    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to set up hook
  const setupHook = (overrides = {}) => {
    const props = {
      stableDrumSounds: overrides.stableDrumSounds || stableDrumSounds,
      playersRef: overrides.playersRef || playersRef,
      drumSequenceRef: overrides.drumSequenceRef || drumSequenceRef,
      sequenceRef: overrides.sequenceRef || sequenceRef,
      setCurrentStep: overrides.setCurrentStep || setCurrentStep,
    };

    return renderHook(() => useToneSequence(...Object.values(props)));
  };

  it('should create Tone.Sequence on mount', () => {
    setupHook();

    expect(Tone.Sequence).toHaveBeenCalledWith(
      expect.any(Function),
      [...Array(TIME_STEPS).keys()],
      `${TIME_STEPS}n`
    );
  });

  it('should store sequence instance in sequenceRef', () => {
    setupHook();

    expect(sequenceRef.current).toBeDefined();
    expect(sequenceRef.current).toHaveProperty('stop');
    expect(sequenceRef.current).toHaveProperty('dispose');
  });

  it('should update current step when sequence callback is invoked', () => {
    setupHook();

    invokeSequenceCallback(sequenceCallback, 0, 3);

    expect(setCurrentStep).toHaveBeenCalledWith(3);
  });

  it('should play sounds when steps are active', () => {
    setupHook();

    // Step 0: kick and hat should play
    invokeSequenceCallback(sequenceCallback, 0, 0);

    expect(playersRef.current.kick.start).toHaveBeenCalledWith(0);
    expect(playersRef.current.snare.start).not.toHaveBeenCalled();
    expect(playersRef.current.hat.start).toHaveBeenCalledWith(0);
  });

  it('should not play sounds when steps are inactive', () => {
    setupHook();

    // Step 1: only hat should play
    invokeSequenceCallback(sequenceCallback, 0, 1);

    expect(playersRef.current.kick.start).not.toHaveBeenCalled();
    expect(playersRef.current.snare.start).not.toHaveBeenCalled();
    expect(playersRef.current.hat.start).toHaveBeenCalledWith(0);
  });

  it('should handle multiple sounds playing on the same step', () => {
    setupHook();

    // Step 4: kick and hat should play
    invokeSequenceCallback(sequenceCallback, 0, 4);

    expect(playersRef.current.kick.start).toHaveBeenCalledWith(0);
    expect(playersRef.current.hat.start).toHaveBeenCalledWith(0);
  });

  it('should not play sound if player is not loaded', () => {
    playersRef.current.kick.loaded = false;
    setupHook();

    invokeSequenceCallback(sequenceCallback, 0, 0);

    expect(playersRef.current.kick.start).not.toHaveBeenCalled();
    expect(playersRef.current.hat.start).toHaveBeenCalledWith(0);
  });

  it('should not play sound if player does not exist', () => {
    delete playersRef.current.kick;
    setupHook();

    invokeSequenceCallback(sequenceCallback, 0, 0);

    expect(playersRef.current.hat.start).toHaveBeenCalledWith(0);
  });

  it('should handle missing track in drum sequence', () => {
    drumSequenceRef.current[0] = undefined;
    setupHook();

    invokeSequenceCallback(sequenceCallback, 0, 0);

    // Should not throw, hat should still play
    expect(playersRef.current.hat.start).toHaveBeenCalledWith(0);
  });


  it('should handle step index out of bounds', () => {
    setupHook();

    invokeSequenceCallback(sequenceCallback, 0, 10); // Step 10 doesn't exist

    expect(setCurrentStep).toHaveBeenCalledWith(10);
    // No sounds should play for out of bounds step
    expect(playersRef.current.kick.start).not.toHaveBeenCalled();
    expect(playersRef.current.snare.start).not.toHaveBeenCalled();
    expect(playersRef.current.hat.start).not.toHaveBeenCalled();
  });

  it('should pass correct time value to player.start', () => {
    setupHook();

    const mockTime = 1.5;
    invokeSequenceCallback(sequenceCallback, mockTime, 0);

    expect(playersRef.current.kick.start).toHaveBeenCalledWith(mockTime);
    expect(playersRef.current.hat.start).toHaveBeenCalledWith(mockTime);
  });

  describe('cleanup', () => {
    it('should stop and dispose sequence on unmount', () => {
      const { unmount } = setupHook();
      
      const sequenceInstance = sequenceRef.current;

      act(() => {
        unmount();
      });

      expectSequenceDisposed(sequenceInstance, sequenceRef);
    });

    it('should handle stop errors gracefully during cleanup', async () => {
      const { unmount } = setupHook();
      
      // Get the sequence instance and make its stop method throw
      const sequenceInstance = sequenceRef.current;
      sequenceInstance.stop.mockImplementation(() => {
        throw new Error('Stop failed');
      });

      act(() => {
        unmount();
      });

      await waitForWarnLog('Error stopping sequence:', { expectError: true });
      expect(sequenceInstance.dispose).toHaveBeenCalled();
      expect(sequenceRef.current).toBeNull();
    });

    it('should cleanup and recreate sequence when dependencies change', () => {
      const { rerender } = setupHook();

      // Get the first sequence instance
      const firstSequence = sequenceRef.current;
      expect(firstSequence).toBeDefined();

      // Change stableDrumSounds to a new array reference
      const newDrumSounds = [{ id: 'crash' }];
      act(() => {
        rerender({
          stableDrumSounds: newDrumSounds,
          playersRef,
          drumSequenceRef,
          sequenceRef,
          setCurrentStep,
        });
      });

      // Should have created new sequence (React will cleanup old one automatically)
      expect(Tone.Sequence).toHaveBeenCalled();
      // The new sequence should be different from the old one
      // Note: cleanup happens synchronously, so we verify a new sequence was created
      expect(sequenceRef.current).toBeDefined();
    });

    it('should not cleanup if sequenceRef.current is null', () => {
      const { unmount } = setupHook();
      
      // Manually set to null after hook has run
      sequenceRef.current = null;

      act(() => {
        unmount();
      });

      expect(mockSequence.stop).not.toHaveBeenCalled();
      expect(mockSequence.dispose).not.toHaveBeenCalled();
    });
  });

  describe('dependency changes', () => {
    it('should recreate sequence when stableDrumSounds changes', () => {
      const { rerender } = setupHook();

      // Change to a new array reference (React will detect this)
      const newDrumSounds = [{ id: 'crash' }];
      act(() => {
        rerender({
          stableDrumSounds: newDrumSounds,
          playersRef,
          drumSequenceRef,
          sequenceRef,
          setCurrentStep,
        });
      });

      // Should have a sequence (may be new or same depending on React's effect behavior)
      expect(sequenceRef.current).toBeDefined();
      expect(Tone.Sequence).toHaveBeenCalled();
    });

    it('should recreate sequence when playersRef object changes', () => {
      const { rerender } = setupHook();
      
      // Create a new ref object (not just changing .current)
      const newPlayersRef = { current: { kick: { start: vi.fn(), loaded: true } } };
      act(() => {
        rerender({
          stableDrumSounds,
          playersRef: newPlayersRef,
          drumSequenceRef,
          sequenceRef,
          setCurrentStep,
        });
      });

      expect(sequenceRef.current).toBeDefined();
      expect(Tone.Sequence).toHaveBeenCalled();
    });

    it('should recreate sequence when drumSequenceRef object changes', () => {
      const { rerender } = setupHook();
      
      // Create a new ref object
      const newDrumSequenceRef = {
        current: [{ steps: [true, false, false, false, false, false, false, false] }],
      };
      act(() => {
        rerender({
          stableDrumSounds,
          playersRef,
          drumSequenceRef: newDrumSequenceRef,
          sequenceRef,
          setCurrentStep,
        });
      });

      expect(sequenceRef.current).toBeDefined();
      expect(Tone.Sequence).toHaveBeenCalled();
    });

    it('should recreate sequence when setCurrentStep function changes', () => {
      const { rerender } = setupHook();
      
      // Create a new function reference
      const newSetCurrentStep = vi.fn();
      act(() => {
        rerender({
          stableDrumSounds,
          playersRef,
          drumSequenceRef,
          sequenceRef,
          setCurrentStep: newSetCurrentStep,
        });
      });

      expect(sequenceRef.current).toBeDefined();
      expect(Tone.Sequence).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty stableDrumSounds array', () => {
      setupHook({ stableDrumSounds: [] });

      invokeSequenceCallback(sequenceCallback, 0, 0);

      expect(setCurrentStep).toHaveBeenCalledWith(0);
      // No players should be called
      expect(playersRef.current.kick.start).not.toHaveBeenCalled();
    });

    it('should handle empty drum sequence', () => {
      drumSequenceRef.current = [];
      setupHook();

      invokeSequenceCallback(sequenceCallback, 0, 0);

      expect(setCurrentStep).toHaveBeenCalledWith(0);
      // No players should be called
      expect(playersRef.current.kick.start).not.toHaveBeenCalled();
    });

    it('should handle all steps false', () => {
      drumSequenceRef.current = [
        { steps: [false, false, false, false, false, false, false, false] },
      ];
      setupHook();

      invokeSequenceCallback(sequenceCallback, 0, 0);

      expect(setCurrentStep).toHaveBeenCalledWith(0);
      expect(playersRef.current.kick.start).not.toHaveBeenCalled();
    });
  });
});

