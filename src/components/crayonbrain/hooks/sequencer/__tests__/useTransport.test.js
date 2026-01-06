import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTransport } from './useTransport';
import * as Tone from 'tone';
import {
  createMockTransport,
  createMockSequence,
  callHookResult,
  waitForErrorLog,
  waitForWarnLog,
} from './__test-utils__';

// Mock Tone.js
vi.mock('tone', () => ({
  getContext: vi.fn(),
  start: vi.fn(),
  getTransport: vi.fn(),
}));

describe('useTransport', () => {
  let mockSequence;
  let mockTransport;
  let setIsPlaying;
  let setCurrentStep;
  let sequenceRef;
  let tempoBpmRef;

  beforeEach(() => {
    // Mock Tone.js context
    Tone.getContext.mockReturnValue({
      state: 'running',
    });

    // Mock Tone.start
    Tone.start.mockResolvedValue(undefined);

    // Mock sequence
    mockSequence = createMockSequence();

    // Mock transport
    mockTransport = createMockTransport({ state: 'stopped', bpm: 120 });

    Tone.getTransport.mockReturnValue(mockTransport);

    // Mock state setters
    setIsPlaying = vi.fn();
    setCurrentStep = vi.fn();

    // Create refs
    sequenceRef = { current: mockSequence };
    tempoBpmRef = { current: 140 };

    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to set up hook
  const setupHook = (isPlaying = false) => {
    return renderHook(() =>
      useTransport(isPlaying, setIsPlaying, setCurrentStep, sequenceRef, tempoBpmRef)
    );
  };

  it('should return handlePlay function', () => {
    const { result } = setupHook();

    expect(result.current).toBeInstanceOf(Function);
  });

  describe('when starting playback', () => {
    it('should start Tone context if not running', async () => {
      Tone.getContext.mockReturnValue({ state: 'suspended' });
      const { result } = setupHook(false);

      await callHookResult(result.current);

      expect(Tone.start).toHaveBeenCalled();
    });

    it('should not start Tone context if already running', async () => {
      Tone.getContext.mockReturnValue({ state: 'running' });
      const { result } = setupHook(false);

      await callHookResult(result.current);

      expect(Tone.start).not.toHaveBeenCalled();
    });

    it('should set transport BPM from tempoBpmRef', async () => {
      tempoBpmRef.current = 160;
      const { result } = setupHook(false);

      await callHookResult(result.current);

      expect(mockTransport.bpm.value).toBe(160);
    });

    it('should start sequence and transport when not playing', async () => {
      const { result } = setupHook(false);

      await callHookResult(result.current);

      expect(mockSequence.start).toHaveBeenCalled();
      expect(mockTransport.start).toHaveBeenCalled();
    });

    it('should set isPlaying to true when transport starts', async () => {
      mockTransport.state = 'started';
      const { result } = setupHook(false);

      await callHookResult(result.current);

      expect(setIsPlaying).toHaveBeenCalledWith(true);
    });

    it('should warn and return early if sequence is not ready', async () => {
      sequenceRef.current = null;
      const { result } = setupHook(false);

      await callHookResult(result.current);

      await waitForWarnLog('Sequence not ready, cannot start playback');
      expect(mockSequence.start).not.toHaveBeenCalled();
      expect(mockTransport.start).not.toHaveBeenCalled();
      expect(setIsPlaying).not.toHaveBeenCalled();
    });

    it('should not set isPlaying if transport did not start', async () => {
      mockTransport.state = 'stopped';
      const { result } = setupHook(false);

      await callHookResult(result.current);

      expect(mockSequence.start).toHaveBeenCalled();
      expect(mockTransport.start).toHaveBeenCalled();
      expect(setIsPlaying).not.toHaveBeenCalled();
    });
  });

  describe('when stopping playback', () => {
    it('should stop transport when playing', async () => {
      const { result } = setupHook(true);

      await callHookResult(result.current);

      expect(mockTransport.stop).toHaveBeenCalled();
      expect(setIsPlaying).toHaveBeenCalledWith(false);
      expect(setCurrentStep).toHaveBeenCalledWith(0);
    });

    it('should reset current step to 0 when stopping', async () => {
      const { result } = setupHook(true);

      await callHookResult(result.current);

      expect(setCurrentStep).toHaveBeenCalledWith(0);
    });
  });

  describe('error handling', () => {
    it('should handle errors and reset state', async () => {
      mockTransport.start.mockImplementation(() => {
        throw new Error('Transport start failed');
      });
      const { result } = setupHook(false);

      await callHookResult(result.current);

      await waitForErrorLog('Error controlling playback:');
      expect(setIsPlaying).toHaveBeenCalledWith(false);
      expect(setCurrentStep).toHaveBeenCalledWith(0);
    });

    it('should handle errors when stopping', async () => {
      mockTransport.stop.mockImplementation(() => {
        throw new Error('Transport stop failed');
      });
      const { result } = setupHook(true);

      await callHookResult(result.current);

      await waitForErrorLog('Error controlling playback:');
      expect(setIsPlaying).toHaveBeenCalledWith(false);
      expect(setCurrentStep).toHaveBeenCalledWith(0);
    });

    it('should handle Tone.start errors', async () => {
      Tone.getContext.mockReturnValue({ state: 'suspended' });
      Tone.start.mockRejectedValue(new Error('Failed to start audio context'));
      const { result } = setupHook(false);

      await callHookResult(result.current);

      await waitForErrorLog('Error controlling playback:');
      expect(setIsPlaying).toHaveBeenCalledWith(false);
      expect(setCurrentStep).toHaveBeenCalledWith(0);
    });
  });

  describe('callback dependencies', () => {
    it('should update when isPlaying changes', async () => {
      const { result, rerender } = renderHook(
        ({ isPlaying }) =>
          useTransport(isPlaying, setIsPlaying, setCurrentStep, sequenceRef, tempoBpmRef),
        { initialProps: { isPlaying: false } }
      );

      // Start playback
      await callHookResult(result.current);

      expect(mockTransport.start).toHaveBeenCalled();

      // Update to playing state
      rerender({ isPlaying: true });

      // Stop playback
      await callHookResult(result.current);

      expect(mockTransport.stop).toHaveBeenCalled();
    });

    it('should use updated tempoBpmRef value', async () => {
      const { result } = setupHook(false);

      tempoBpmRef.current = 180;

      await callHookResult(result.current);

      expect(mockTransport.bpm.value).toBe(180);
    });
  });
});

