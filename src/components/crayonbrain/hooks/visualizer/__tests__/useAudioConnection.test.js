import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioConnection } from '../useAudioConnection';
import * as Tone from 'tone';

// Mock Tone.js
vi.mock('tone', () => ({
  getDestination: vi.fn(),
}));

describe('useAudioConnection', () => {
  let mockAudioContext;
  let mockAnalyser;
  let mockGainNode;
  let mockMasterGain;
  let audioSourceRef;
  let analyserRef;
  let audioCtxRef;
  let connectedGainRef;

  beforeEach(() => {
    // Mock Web Audio API nodes
    mockGainNode = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    mockAnalyser = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    mockMasterGain = {
      connect: vi.fn(),
    };

    mockAudioContext = {
      createGain: vi.fn(() => mockGainNode),
      createMediaStreamDestination: vi.fn(() => ({
        connect: vi.fn(),
      })),
    };

    // Mock Tone.getDestination
    Tone.getDestination.mockReturnValue({
      input: mockMasterGain,
    });

    // Create refs
    audioSourceRef = { current: null };
    analyserRef = { current: mockAnalyser };
    audioCtxRef = { current: mockAudioContext };
    connectedGainRef = { current: null };

    // Mock console.warn
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  // Helper function to set up hook with optional audio source
  const setupHook = (audioSource = null) => {
    audioSourceRef.current = audioSource;
    return renderHook(() =>
      useAudioConnection(audioSourceRef, analyserRef, audioCtxRef, connectedGainRef)
    );
  };

  it('should return connectAnalyser function', () => {
    const { result } = setupHook();

    expect(result.current).toBeInstanceOf(Function);
  });

  it('should not connect if analyser is missing', () => {
    analyserRef.current = null;
    const { result } = setupHook();

    act(() => {
      result.current();
    });

    expect(mockGainNode.connect).not.toHaveBeenCalled();
  });

  it('should not connect if audioCtx is missing', () => {
    audioCtxRef.current = null;
    const { result } = setupHook();

    act(() => {
      result.current();
    });

    expect(mockGainNode.connect).not.toHaveBeenCalled();
  });

  it('should connect audioSource to analyser when available', () => {
    const { result } = setupHook(mockGainNode);

    act(() => {
      result.current();
    });

    expect(mockGainNode.connect).toHaveBeenCalledWith(mockAnalyser);
    expect(connectedGainRef.current).toBe(mockGainNode);
  });

  it('should disconnect previous connection before connecting new one', () => {
    const previousGain = { connect: vi.fn(), disconnect: vi.fn() };
    connectedGainRef.current = previousGain;
    const { result } = setupHook(mockGainNode);

    act(() => {
      result.current();
    });

    expect(previousGain.disconnect).toHaveBeenCalledWith(mockAnalyser);
    expect(connectedGainRef.current).toBe(mockGainNode);
  });

  it('should create fallback gain when audioSource is not available', () => {
    const { result } = setupHook(null);

    act(() => {
      result.current();
    });

    expect(mockAudioContext.createGain).toHaveBeenCalled();
    expect(mockGainNode.connect).toHaveBeenCalledWith(mockAnalyser);
    expect(mockMasterGain.connect).toHaveBeenCalledWith(mockGainNode);
    expect(connectedGainRef.current).toBe(mockGainNode);
  });

  it('should use mediaStreamDestination fallback when Tone.getDestination fails', () => {
    Tone.getDestination.mockReturnValue({ input: null });
    const { result } = setupHook(null);

    act(() => {
      result.current();
    });

    expect(mockAudioContext.createMediaStreamDestination).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('Using alternative audio routing fallback');
  });

  it('should poll for audioSource availability', async () => {
    vi.useFakeTimers();
    setupHook(null);

    // Initially no connection
    expect(connectedGainRef.current).toBeNull();

    // Make audioSource available
    act(() => {
      audioSourceRef.current = mockGainNode;
    });

    // Advance timer to trigger polling check
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should have connected
    expect(mockGainNode.connect).toHaveBeenCalledWith(mockAnalyser);
    expect(connectedGainRef.current).toBe(mockGainNode);
  });

  it('should stop polling once connected to audioSource', () => {
    vi.useFakeTimers();
    setupHook(null);

    act(() => {
      audioSourceRef.current = mockGainNode;
      vi.advanceTimersByTime(100);
    });

    // Should have connected
    expect(connectedGainRef.current).toBe(mockGainNode);

    // Advance more time - should not poll again since already connected
    const connectCallCount = mockGainNode.connect.mock.calls.length;
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should not have called connect again
    expect(mockGainNode.connect).toHaveBeenCalledTimes(connectCallCount);
  });

  it('should cleanup interval on unmount', () => {
    vi.useFakeTimers();
    // Ensure clearInterval is available as a spy
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval').mockImplementation(() => {});
    const { unmount } = setupHook(null);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      unmount();
    });

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('should handle disconnect errors gracefully', () => {
    const errorGain = {
      connect: vi.fn(),
      disconnect: vi.fn(() => {
        throw new Error('Disconnect failed');
      }),
    };
    connectedGainRef.current = errorGain;
    const { result } = setupHook(mockGainNode);

    act(() => {
      result.current();
    });

    // Should still connect despite disconnect error
    expect(mockGainNode.connect).toHaveBeenCalled();
  });

  it('should handle connection errors gracefully', () => {
    mockGainNode.connect.mockImplementation(() => {
      throw new Error('Connection failed');
    });
    const { result } = setupHook(mockGainNode);

    act(() => {
      result.current();
    });

    expect(console.warn).toHaveBeenCalledWith(
      'failed to connect analyser to audio source',
      expect.any(Error)
    );
  });
});

