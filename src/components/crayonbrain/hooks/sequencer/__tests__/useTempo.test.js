import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTempo } from './useTempo';
import * as Tone from 'tone';
import { createMockTransport } from './__test-utils__';

// Mock Tone.js
vi.mock('tone', () => ({
  getTransport: vi.fn(),
}));

describe('useTempo', () => {
  let mockTransport;
  let tempoBpmRef;

  beforeEach(() => {
    // Mock transport
    mockTransport = createMockTransport({ state: 'stopped', bpm: 120 });

    Tone.getTransport.mockReturnValue(mockTransport);

    // Create ref
    tempoBpmRef = { current: 120 };

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Helper function to set up hook
  const setupHook = (tempoBpm = 120) => {
    return renderHook(() => useTempo(tempoBpm, tempoBpmRef));
  };

  it('should update tempoBpmRef.current with tempoBpm value', () => {
    setupHook(140);

    expect(tempoBpmRef.current).toBe(140);
  });

  it('should update tempoBpmRef when tempoBpm changes', () => {
    const { rerender } = renderHook(
      ({ tempoBpm }) => useTempo(tempoBpm, tempoBpmRef),
      { initialProps: { tempoBpm: 120 } }
    );

    expect(tempoBpmRef.current).toBe(120);

    act(() => {
      rerender({ tempoBpm: 160 });
    });

    expect(tempoBpmRef.current).toBe(160);
  });

  describe('when transport is started', () => {
    beforeEach(() => {
      mockTransport.state = 'started';
    });

    it('should update Transport BPM when tempoBpm changes', () => {
      setupHook(140);

      expect(mockTransport.bpm.value).toBe(140);
    });

    it('should update Transport BPM when tempoBpm changes after initial render', () => {
      const { rerender } = renderHook(
        ({ tempoBpm }) => useTempo(tempoBpm, tempoBpmRef),
        { initialProps: { tempoBpm: 120 } }
      );

      expect(mockTransport.bpm.value).toBe(120);

      act(() => {
        rerender({ tempoBpm: 180 });
      });

      expect(mockTransport.bpm.value).toBe(180);
    });

    it('should update both ref and Transport BPM', () => {
      setupHook(150);

      expect(tempoBpmRef.current).toBe(150);
      expect(mockTransport.bpm.value).toBe(150);
    });
  });

  describe('when transport is stopped', () => {
    beforeEach(() => {
      mockTransport.state = 'stopped';
    });

    it('should update tempoBpmRef but not Transport BPM', () => {
      const initialBpm = mockTransport.bpm.value;
      setupHook(160);

      expect(tempoBpmRef.current).toBe(160);
      // Transport BPM should not change when stopped
      expect(mockTransport.bpm.value).toBe(initialBpm);
    });

    it('should not update Transport BPM when tempoBpm changes', () => {
      const { rerender } = renderHook(
        ({ tempoBpm }) => useTempo(tempoBpm, tempoBpmRef),
        { initialProps: { tempoBpm: 120 } }
      );
      const initialBpm = mockTransport.bpm.value;

      act(() => {
        rerender({ tempoBpm: 200 });
      });

      expect(tempoBpmRef.current).toBe(200);
      expect(mockTransport.bpm.value).toBe(initialBpm);
    });
  });

  describe('when transport state changes', () => {
    it('should update Transport BPM when transport starts and tempo changes', () => {
      mockTransport.state = 'stopped';
      const { rerender } = renderHook(
        ({ tempoBpm }) => useTempo(tempoBpm, tempoBpmRef),
        { initialProps: { tempoBpm: 140 } }
      );

      // Initially stopped, so BPM shouldn't update
      expect(tempoBpmRef.current).toBe(140);
      expect(mockTransport.bpm.value).toBe(120); // Initial value

      // Transport starts
      mockTransport.state = 'started';

      // Tempo changes while started
      act(() => {
        rerender({ tempoBpm: 150 });
      });

      // Now should update Transport BPM
      expect(mockTransport.bpm.value).toBe(150);
    });

    it('should stop updating Transport BPM when transport stops', () => {
      mockTransport.state = 'started';
      const { rerender } = renderHook(
        ({ tempoBpm }) => useTempo(tempoBpm, tempoBpmRef),
        { initialProps: { tempoBpm: 130 } }
      );

      expect(mockTransport.bpm.value).toBe(130);

      // Transport stops
      mockTransport.state = 'stopped';

      // Tempo changes while stopped
      act(() => {
        rerender({ tempoBpm: 170 });
      });

      // Ref should update but Transport BPM should remain at previous value
      expect(tempoBpmRef.current).toBe(170);
      expect(mockTransport.bpm.value).toBe(130); // Previous value when started
    });
  });

  describe('edge cases', () => {
    it('should handle tempo value of 0', () => {
      setupHook(0);

      expect(tempoBpmRef.current).toBe(0);
    });

    it('should handle very high tempo values', () => {
      setupHook(300);

      expect(tempoBpmRef.current).toBe(300);
    });

    it('should handle decimal tempo values', () => {
      setupHook(120.5);

      expect(tempoBpmRef.current).toBe(120.5);
    });

    it('should handle negative tempo values', () => {
      setupHook(-50);

      expect(tempoBpmRef.current).toBe(-50);
    });

    it('should handle tempo value changes correctly', () => {
      const { rerender } = renderHook(
        ({ tempoBpm }) => useTempo(tempoBpm, tempoBpmRef),
        { initialProps: { tempoBpm: 100 } }
      );

      expect(tempoBpmRef.current).toBe(100);

      act(() => {
        rerender({ tempoBpm: 250 });
      });

      expect(tempoBpmRef.current).toBe(250);
    });
  });

  describe('ref updates', () => {
    it('should update ref immediately on mount', () => {
      tempoBpmRef.current = 100;
      setupHook(125);

      expect(tempoBpmRef.current).toBe(125);
    });

    it('should update ref when tempoBpmRef object changes', () => {
      const newTempoBpmRef = { current: 100 };
      const { rerender } = renderHook(
        ({ tempoBpm, ref }) => useTempo(tempoBpm, ref),
        { initialProps: { tempoBpm: 120, ref: tempoBpmRef } }
      );

      act(() => {
        rerender({ tempoBpm: 140, ref: newTempoBpmRef });
      });

      expect(newTempoBpmRef.current).toBe(140);
    });
  });
});

