import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePresetSwitching } from './usePresetSwitching';
import { loadPreset } from './presetLoader';
import { PRESET_INDICES, PRESET_BLEND_TIME } from '../../utils/visualizerConstants';
import {
  createMockVisualizer,
  createMockPresets,
} from './__test-utils__';

// Mock dependencies
vi.mock('./presetLoader', () => ({
  loadPreset: vi.fn(() => true),
}));

vi.mock('../../utils/visualizerConstants', () => ({
  PRESET_INDICES: [0, 54, 77],
  PRESET_BLEND_TIME: 1.0,
}));

describe('usePresetSwitching', () => {
  let visualizerRef;
  let presetsRef;
  let mockVisualizer;
  let mockPresets;

  beforeEach(() => {
    // Mock visualizer
    mockVisualizer = createMockVisualizer({ withConnectAudio: false });

    // Mock presets object - keys array indices must match PRESET_INDICES values
    // PRESET_INDICES = [0, 54, 77], so keys[0], keys[54], keys[77] should exist
    mockPresets = createMockPresets({ totalPresets: 78 });

    visualizerRef = { current: mockVisualizer };
    presetsRef = { current: null };

    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  // Helper function to set up hook with optional presets
  const setupHook = (presets = null, visualizer = mockVisualizer) => {
    visualizerRef.current = visualizer;
    presetsRef.current = presets;
    return renderHook(() => usePresetSwitching(visualizerRef, presetsRef));
  };

  it('should return initial state', () => {
    const { result } = setupHook(mockPresets);

    expect(result.current.currentPresetSelection).toBe(0);
    expect(result.current.presetName).toBe('Preset 0');
    expect(result.current.switchPreset).toBeInstanceOf(Function);
  });

  it('should return "Loading..." when presets are not loaded', () => {
    const { result } = setupHook(null);

    expect(result.current.presetName).toBe('Loading...');
  });

  it('should poll for presets when not loaded', () => {
    vi.useFakeTimers();
    const { result } = setupHook(null);

    // Initially should show "Loading..."
    expect(result.current.presetName).toBe('Loading...');

    // Make presets available
    act(() => {
      presetsRef.current = mockPresets;
    });

    // Advance timer to trigger polling check
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should have loaded presets
    expect(result.current.presetName).toBe('Preset 0');
  });

  it('should stop polling once presets are loaded', () => {
    vi.useFakeTimers();
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval').mockImplementation(() => {});
    setupHook(null);

    act(() => {
      presetsRef.current = mockPresets;
      vi.advanceTimersByTime(100);
    });

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('should load initial preset when presets are available', () => {
    setupHook(mockPresets);

    expect(loadPreset).toHaveBeenCalledWith(
      mockVisualizer,
      mockPresets,
      PRESET_INDICES[0],
      PRESET_BLEND_TIME
    );
  });

  it('should get correct preset name for selection 0', () => {
    const { result } = setupHook(mockPresets);

    expect(result.current.currentPresetSelection).toBe(0);
    expect(result.current.presetName).toBe('Preset 0');
  });

  it('should get correct preset name for selection 1', () => {
    const { result } = setupHook(mockPresets);

    act(() => {
      result.current.switchPreset('next');
    });

    expect(result.current.currentPresetSelection).toBe(1);
    expect(result.current.presetName).toBe('Preset 54');
  });

  it('should get correct preset name for selection 2', () => {
    const { result } = setupHook(mockPresets);

    act(() => {
      result.current.switchPreset('next');
    });

    expect(result.current.currentPresetSelection).toBe(1);

    act(() => {
      result.current.switchPreset('next');
    });

    expect(result.current.currentPresetSelection).toBe(2);
    expect(result.current.presetName).toBe('Preset 77');
  });

  it('should return "Unknown Preset" for invalid index', () => {
    // Create presets with fewer keys than PRESET_INDICES
    const limitedPresets = {
      'Preset 0': { data: 'preset0' },
    };
    const { result } = setupHook(limitedPresets);

    act(() => {
      result.current.switchPreset('next');
    });

    expect(result.current.presetName).toBe('Unknown Preset');
  });

  it('should switch to next preset', () => {
    const { result } = setupHook(mockPresets);

    act(() => {
      result.current.switchPreset('next');
    });

    expect(result.current.currentPresetSelection).toBe(1);
    expect(loadPreset).toHaveBeenCalledWith(
      mockVisualizer,
      mockPresets,
      PRESET_INDICES[1],
      PRESET_BLEND_TIME
    );
  });

  it('should wrap around when switching next from last preset', () => {
    const { result } = setupHook(mockPresets);

    // Go to last preset
    act(() => {
      result.current.switchPreset('next');
    });

    act(() => {
      result.current.switchPreset('next');
    });

    expect(result.current.currentPresetSelection).toBe(2);

    // Switch next should wrap to 0
    act(() => {
      result.current.switchPreset('next');
    });

    expect(result.current.currentPresetSelection).toBe(0);
    expect(loadPreset).toHaveBeenCalledWith(
      mockVisualizer,
      mockPresets,
      PRESET_INDICES[0],
      PRESET_BLEND_TIME
    );
  });

  it('should switch to previous preset', () => {
    const { result } = setupHook(mockPresets);

    // First go to preset 1
    act(() => {
      result.current.switchPreset('next');
    });

    // Then go back
    act(() => {
      result.current.switchPreset('prev');
    });

    expect(result.current.currentPresetSelection).toBe(0);
    expect(loadPreset).toHaveBeenCalledWith(
      mockVisualizer,
      mockPresets,
      PRESET_INDICES[0],
      PRESET_BLEND_TIME
    );
  });

  it('should wrap around when switching prev from first preset', () => {
    const { result } = setupHook(mockPresets);

    act(() => {
      result.current.switchPreset('prev');
    });

    expect(result.current.currentPresetSelection).toBe(2);
    expect(loadPreset).toHaveBeenCalledWith(
      mockVisualizer,
      mockPresets,
      PRESET_INDICES[2],
      PRESET_BLEND_TIME
    );
  });

  it('should not switch if visualizer is not available', () => {
    const { result } = setupHook(mockPresets, null);

    act(() => {
      result.current.switchPreset('next');
    });

    // Should not have changed selection
    expect(result.current.currentPresetSelection).toBe(0);
    expect(loadPreset).not.toHaveBeenCalled();
  });

  it('should not switch if presets are not available', () => {
    const { result } = setupHook(null, mockVisualizer);

    act(() => {
      result.current.switchPreset('next');
    });

    // Should not have changed selection
    expect(result.current.currentPresetSelection).toBe(0);
    expect(loadPreset).not.toHaveBeenCalled();
  });

  it('should load preset when selection changes via useEffect', () => {
    const { result } = setupHook(mockPresets);
    loadPreset.mockClear();

    act(() => {
      result.current.switchPreset('next');
    });

    // Should be called twice: once in switchPreset, once in useEffect
    expect(loadPreset).toHaveBeenCalledTimes(2);
    expect(loadPreset).toHaveBeenLastCalledWith(
      mockVisualizer,
      mockPresets,
      PRESET_INDICES[1],
      PRESET_BLEND_TIME
    );
  });

  it('should load preset when visualizer becomes available', () => {
    const { result, rerender } = renderHook(
      ({ visRef, presRef }) => usePresetSwitching(visRef, presRef),
      {
        initialProps: {
          visRef: { current: null },
          presRef: { current: mockPresets },
        },
      }
    );

    loadPreset.mockClear();

    // Make visualizer available
    act(() => {
      rerender({
        visRef: { current: mockVisualizer },
        presRef: { current: mockPresets },
      });
    });

    expect(loadPreset).toHaveBeenCalledWith(
      mockVisualizer,
      mockPresets,
      PRESET_INDICES[0],
      PRESET_BLEND_TIME
    );
  });

  it('should load preset when presets become available', () => {
    const { result, rerender } = renderHook(
      ({ visRef, presRef }) => usePresetSwitching(visRef, presRef),
      {
        initialProps: {
          visRef: { current: mockVisualizer },
          presRef: { current: null },
        },
      }
    );

    loadPreset.mockClear();

    // Make presets available
    act(() => {
      rerender({
        visRef: { current: mockVisualizer },
        presRef: { current: mockPresets },
      });
    });

    expect(loadPreset).toHaveBeenCalledWith(
      mockVisualizer,
      mockPresets,
      PRESET_INDICES[0],
      PRESET_BLEND_TIME
    );
  });

  it('should cleanup polling interval on unmount', () => {
    vi.useFakeTimers();
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
});

